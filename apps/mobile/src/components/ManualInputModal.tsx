import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    DeviceEventEmitter,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { apiClient } from '@/src/api/client';
import * as SecureStore from 'expo-secure-store';
import { AddWalletModal } from '@/src/components/AddWalletModal';
import { formatRupiah } from '@/src/utils/format';

interface ManualInputModalProps {
    visible: boolean;
    onClose: () => void;
}

type Tab = 'cashflow' | 'investment';
type TxType = 'buy' | 'sell';

function Dropdown({
    label,
    options,
    selected,
    onSelect,
}: {
    label: string;
    options: { value: string; label: string }[];
    selected: string;
    onSelect: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find(o => o.value === selected);

    return (
        <View className="mb-4">
            <Text className="text-txt-secondary text-xs font-semibold mb-1.5">{label}</Text>
            <TouchableOpacity
                onPress={() => setOpen(!open)}
                activeOpacity={0.7}
                className={`bg-input-bg rounded-xl p-3.5 border flex-row justify-between items-center ${open ? 'border-primary/60' : 'border-surface-border'
                    }`}
            >
                <Text className={`text-[15px] ${selectedOption ? 'text-txt' : 'text-txt-muted'}`}>
                    {selectedOption?.label ?? 'Pilih...'}
                </Text>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.textMuted}
                />
            </TouchableOpacity>
            {open && (
                <View className="bg-surface-el rounded-xl mt-1 border border-surface-border overflow-hidden">
                    {options.map((opt, idx) => (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() => {
                                onSelect(opt.value);
                                setOpen(false);
                            }}
                            className={`p-3.5 ${idx < options.length - 1 ? 'border-b border-divider' : ''} ${opt.value === selected ? 'bg-primary/15' : ''
                                }`}
                        >
                            <Text
                                className={`text-sm ${opt.value === selected ? 'text-primary-light font-semibold' : 'text-txt'
                                    }`}
                            >
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

function ToggleButton({
    value,
    onChange,
}: {
    value: TxType;
    onChange: (v: TxType) => void;
}) {
    return (
        <View className="mb-4">
            <Text className="text-txt-secondary text-xs font-semibold mb-1.5">Tipe Transaksi</Text>
            <View className="flex-row bg-input-bg rounded-xl p-1 border border-surface-border">
                <TouchableOpacity
                    onPress={() => onChange('buy')}
                    className={`flex-1 py-2.5 rounded-[9px] items-center ${value === 'buy' ? 'bg-profit/25' : ''
                        }`}
                >
                    <Text className={`font-bold text-sm ${value === 'buy' ? 'text-profit' : 'text-txt-muted'}`}>
                        🟢 Beli
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onChange('sell')}
                    className={`flex-1 py-2.5 rounded-[9px] items-center ${value === 'sell' ? 'bg-loss/25' : ''
                        }`}
                >
                    <Text className={`font-bold text-sm ${value === 'sell' ? 'text-loss' : 'text-txt-muted'}`}>
                        🔴 Jual
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export function ManualInputModal({ visible, onClose }: ManualInputModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('cashflow');

    const [cfWallet, setCfWallet] = useState('');
    const [cfCategory, setCfCategory] = useState('');
    const [cfAmount, setCfAmount] = useState('');
    const [cfNote, setCfNote] = useState('');

    const [invType, setInvType] = useState<TxType>('buy');
    const [invAssetType, setInvAssetType] = useState('');
    const [invSymbol, setInvSymbol] = useState('');
    const [invQty, setInvQty] = useState('');

    const [invWallet, setInvWallet] = useState('');
    const [selectedAssetPrice, setSelectedAssetPrice] = useState<number | null>(null);
    const [fetchingPrice, setFetchingPrice] = useState(false);

    // Dynamic Lists
    const [wallets, setWallets] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [portfolios, setPortfolios] = useState<any[]>([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [showAddWallet, setShowAddWallet] = useState(false);

    const loadOptions = async () => {
        try {
            setModalLoading(true);
            const strUserId = await SecureStore.getItemAsync('userId');
            if (!strUserId) return;

            const [wRes, cRes, aRes, pRes] = await Promise.all([
                apiClient.get(`/wallets/${strUserId}`),
                apiClient.get('/categories'),
                apiClient.get('/assets'),
                apiClient.get(`/portfolios/user/${strUserId}`)
            ]);

            const wlts = Array.isArray(wRes.data?.data) ? wRes.data.data : (Array.isArray(wRes.data) ? wRes.data : []);
            const cats = Array.isArray(cRes.data?.data) ? cRes.data.data : (Array.isArray(cRes.data) ? cRes.data : []);
            const asts = Array.isArray(aRes.data?.data) ? aRes.data.data : (Array.isArray(aRes.data) ? aRes.data : []);
            const ports = Array.isArray(pRes.data?.data) ? pRes.data.data : (Array.isArray(pRes.data) ? pRes.data : []);

            setWallets(wlts);
            setCategories(cats);
            setAssets(asts);
            setPortfolios(ports);
        } catch (e: any) {
            console.error('Failed to load modal options', e.response?.data || e.message);
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        if (!visible) return;
        loadOptions();
    }, [visible]);

    useEffect(() => {
        if (!invSymbol) {
            setSelectedAssetPrice(null);
            return;
        }
        
        const selectedAsset = assets.find(a => String(a.id) === invSymbol);
        if (!selectedAsset) return;

        const ticker = selectedAsset.ticker_symbol || selectedAsset.tickerSymbol;
        if (!ticker) return;

        const fetchPrice = async () => {
            try {
                setFetchingPrice(true);
                const res = await apiClient.get(`/assets/quote/${ticker}`);
                const priceVal = res.data?.data;
                if (priceVal !== undefined && priceVal !== null) {
                    setSelectedAssetPrice(Number(priceVal));
                } else {
                    setSelectedAssetPrice(Number(selectedAsset.current_price || selectedAsset.currentPrice || 0));
                }
            } catch (err) {
                console.error("Failed to fetch asset quote", err);
                setSelectedAssetPrice(Number(selectedAsset.current_price || selectedAsset.currentPrice || 0));
            } finally {
                setFetchingPrice(false);
            }
        };

        fetchPrice();
    }, [invSymbol, assets]);

    const walletOptions = wallets.map(w => ({ value: String(w.id || w.wallet_id), label: `${w.icon || '🏦'} ${w.name}` }));
    const categoryOptions = categories.map(c => ({ value: String(c.id), label: `${c.icon || '📌'} ${c.name}` }));
    // Asset IDs owned by the user (quantity > 0)
    const ownedAssetIds = portfolios
        .filter(p => Number(p.quantity) > 0)
        .map(p => p.asset_id ?? p.assetId);

    const allAssetTypeOptions = [
        { value: 'Crypto', label: '₿ Kripto' },
        { value: 'Stock', label: '📊 Saham' },
        { value: 'Mutual Fund', label: '📦 Reksa Dana' },
    ];

    // When selling, only show asset types the user actually owns
    const assetTypeOptions = invType === 'sell'
        ? allAssetTypeOptions.filter(opt => {
            return assets.some(a =>
                (a.asset_type === opt.value || a.assetType === opt.value) &&
                ownedAssetIds.includes(a.id)
            );
        })
        : allAssetTypeOptions;
    
    const symbolOptions = assets
        .filter(a => {
            const matchesType = a.asset_type === invAssetType || a.assetType === invAssetType;
            if (!matchesType) return false;
            // When selling, only show assets the user owns
            if (invType === 'sell') {
                return ownedAssetIds.includes(a.id);
            }
            return true;
        })
        .map(a => {
            const portfolio = portfolios.find(p => (p.asset_id ?? p.assetId) === a.id);
            const qty = portfolio ? Number(portfolio.quantity) : 0;
            const baseLabel = `${a.ticker_symbol || a.tickerSymbol} — ${a.name}`;
            return {
                value: String(a.id),
                label: invType === 'sell' ? `${baseLabel} (${qty} unit)` : baseLabel,
            };
        });

    const resetForm = () => {
        setCfWallet(''); setCfCategory(''); setCfAmount(''); setCfNote('');
        setInvType('buy'); setInvAssetType(''); setInvSymbol('');
        setInvQty(''); setInvWallet('');
        setSelectedAssetPrice(null);
    };

    const handleSave = async () => {
        try {
            if (activeTab === 'cashflow') {
                if (!cfWallet || !cfCategory || !cfAmount) {
                    Alert.alert('Error', 'Harap isi dompet, kategori, dan nominal.');
                    return;
                }
                const isExpense = categories.find(c => String(c.id) === cfCategory)?.type === 'expense';
                const amountNum = Number(cfAmount);
                const finalAmount = isExpense ? -Math.abs(amountNum) : Math.abs(amountNum);
                
                const payload = {
                    wallet_id: Number(cfWallet),
                    category_id: Number(cfCategory),
                    amount: finalAmount,
                    description: cfNote || 'Transaksi Manual',
                    transaction_type: isExpense ? 'expense' : 'income'
                };

                await apiClient.post('/transactions', payload);
            } else {
                if (!invWallet || !invQty || !invSymbol) {
                    Alert.alert('Error', 'Harap isi semua data investasi (termasuk simbol aset).');
                    return;
                }
                const selectedAsset = assets.find(a => String(a.id) === invSymbol);
                if (!selectedAsset) {
                    Alert.alert('Error', 'Aset tidak ditemukan.');
                    return;
                }

                // Validate sell quantity does not exceed owned quantity
                if (invType === 'sell') {
                    const portfolio = portfolios.find(p => (p.asset_id ?? p.assetId) === selectedAsset.id);
                    const ownedQty = portfolio ? Number(portfolio.quantity) : 0;
                    if (Number(invQty) > ownedQty) {
                        Alert.alert(
                            'Jumlah Melebihi Kepemilikan',
                            `Kamu hanya memiliki ${ownedQty} unit ${selectedAsset.ticker_symbol || selectedAsset.tickerSymbol || selectedAsset.name}. Tidak bisa menjual ${invQty} unit.`
                        );
                        return;
                    }
                }

                let price = selectedAssetPrice !== null ? selectedAssetPrice : Number(selectedAsset.current_price || selectedAsset.currentPrice || 0);
                
                if (price === 0) {
                    const ticker = selectedAsset.ticker_symbol || selectedAsset.tickerSymbol;
                    if (ticker) {
                        try {
                            const res = await apiClient.get(`/assets/quote/${ticker}`);
                            const priceVal = res.data?.data;
                            if (priceVal !== undefined && priceVal !== null) {
                                price = Number(priceVal);
                            }
                        } catch (err) {
                            console.error("Failed to fetch asset quote on save", err);
                        }
                    }
                }

                const amountNum = Number(invQty) * price;
                const finalAmount = invType === 'buy' ? -Math.abs(amountNum) : Math.abs(amountNum);
                const invCat = categories.find(c => c.name?.toLowerCase().includes('investasi'))?.id || categories[0]?.id || 1;
                
                const transactionPayload = {
                    wallet_id: Number(invWallet),
                    category_id: Number(invCat),
                    amount: finalAmount,
                    description: `${invType === 'buy' ? 'Beli' : 'Jual'} ${selectedAsset.name || invAssetType}`,
                    transaction_type: invType === 'buy' ? 'expense' : 'income'
                };

                const strUserId = await SecureStore.getItemAsync('userId');
                if (!strUserId) {
                    Alert.alert('Error', 'User ID tidak ditemukan. Harap masuk kembali.');
                    return;
                }

                const portfolioPayload = {
                    user_id: Number(strUserId),
                    asset_id: Number(invSymbol),
                    quantity: invType === 'buy' ? Number(invQty) : -Number(invQty)
                };

                // Catat transaksi keuangan (mengubah saldo dompet)
                await apiClient.post('/transactions', transactionPayload);

                // Tambahkan/kurangi aset ke portfolio
                await apiClient.post('/portfolios', portfolioPayload);
            }
            
            DeviceEventEmitter.emit('refreshDashboard');
            
            Alert.alert('Sukses', 'Data berhasil dikirim ke server!');
            resetForm();
            onClose();
        } catch (error: any) {
            console.error('Error saving transaction:', error.response?.data || error.message);
            Alert.alert('Gagal', 'Terjadi kesalahan saat menghubungi server.');
        }
    };

    // Wallet guard: if loading done and no wallets, show prompt screen
    const hasNoWallet = !modalLoading && wallets.length === 0;

    return (
        <>
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable className="flex-1 bg-black/55" onPress={onClose} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl max-h-[88%]"
            >
                <View className="items-center pt-3 pb-1">
                    <View className="w-10 h-1 rounded-sm bg-txt-muted" />
                </View>

                <View className="flex-row justify-between items-center px-5 pt-2 pb-3">
                    <Text className="text-txt text-xl font-extrabold">Input Manual</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Wallet Guard */}
                {modalLoading ? (
                    <View className="items-center justify-center py-16 px-5">
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text className="text-txt-secondary mt-3 text-sm">Memuat data...</Text>
                    </View>
                ) : hasNoWallet ? (
                    <View className="items-center justify-center py-10 px-8">
                        <View className="w-20 h-20 rounded-3xl bg-primary/15 items-center justify-center mb-4">
                            <Ionicons name="wallet-outline" size={40} color={Colors.primary} />
                        </View>
                        <Text className="text-txt text-[17px] font-extrabold text-center mb-2">
                            Dompet Diperlukan
                        </Text>
                        <Text className="text-txt-secondary text-[13px] text-center leading-5 mb-6">
                            Kamu belum memiliki dompet. Buat dompet terlebih dahulu untuk mulai mencatat pemasukan, pengeluaran, atau investasi.
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowAddWallet(true)}
                            activeOpacity={0.85}
                            className="flex-row items-center bg-primary rounded-xl px-6 py-3.5"
                            style={{
                                shadowColor: Colors.primary,
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.35,
                                shadowRadius: 10,
                                elevation: 7,
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="white" />
                            <Text className="text-white font-bold text-[15px] ml-2">Buat Dompet Sekarang</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} className="mt-4 py-2">
                            <Text className="text-txt-muted text-[13px]">Nanti saja</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                    <View className="flex-row mx-5 bg-input-bg rounded-xl p-1 mb-5 border border-surface-border">
                        <TouchableOpacity
                            onPress={() => setActiveTab('cashflow')}
                            className={`flex-1 py-2.5 rounded-[9px] items-center ${activeTab === 'cashflow' ? 'bg-primary' : ''
                                }`}
                        >
                            <Text className={`font-bold text-[13px] ${activeTab === 'cashflow' ? 'text-white' : 'text-txt-secondary'}`}>
                                💸 Arus Kas
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('investment')}
                            className={`flex-1 py-2.5 rounded-[9px] items-center ${activeTab === 'investment' ? 'bg-primary' : ''
                                }`}
                        >
                            <Text className={`font-bold text-[13px] ${activeTab === 'investment' ? 'text-white' : 'text-txt-secondary'}`}>
                                📈 Investasi
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <KeyboardAwareScrollView
                        style={{ paddingHorizontal: 20 }}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        enableOnAndroid={true}
                        extraScrollHeight={20}
                    >
                        {activeTab === 'cashflow' ? (
                            <>
                                <Dropdown label="Dompet" options={walletOptions} selected={cfWallet} onSelect={setCfWallet} />
                                <Dropdown label="Kategori" options={categoryOptions} selected={cfCategory} onSelect={setCfCategory} />
                                <View className="mb-4">
                                    <Text className="text-txt-secondary text-xs font-semibold mb-1.5">Nominal (Rp)</Text>
                                    <TextInput
                                        className="bg-input-bg rounded-xl p-3.5 text-txt text-[15px] border border-surface-border"
                                        placeholder="0"
                                        placeholderTextColor={Colors.textMuted}
                                        keyboardType="numeric"
                                        value={cfAmount}
                                        onChangeText={setCfAmount}
                                    />
                                </View>
                                <View className="mb-5">
                                    <Text className="text-txt-secondary text-xs font-semibold mb-1.5">Catatan</Text>
                                    <TextInput
                                        className="bg-input-bg rounded-xl p-3.5 text-txt text-[15px] border border-surface-border"
                                        placeholder="Deskripsi singkat..."
                                        placeholderTextColor={Colors.textMuted}
                                        value={cfNote}
                                        onChangeText={setCfNote}
                                    />
                                </View>
                            </>
                        ) : (
                            <>
                                <ToggleButton value={invType} onChange={(v) => { setInvType(v); setInvAssetType(''); setInvSymbol(''); }} />
                                <Dropdown
                                    label="Jenis Aset"
                                    options={assetTypeOptions}
                                    selected={invAssetType}
                                    onSelect={(v) => { setInvAssetType(v); setInvSymbol(''); }}
                                />
                                {invAssetType !== '' && (
                                    <Dropdown label="Simbol Aset" options={symbolOptions} selected={invSymbol} onSelect={setInvSymbol} />
                                )}
                                
                                {invSymbol !== '' && (
                                     <View className="mb-4 bg-primary/10 border border-primary/20 rounded-xl p-3.5 flex-row justify-between items-center">
                                         <View>
                                             <Text className="text-txt-secondary text-xs font-semibold">Harga Per Unit</Text>
                                             {fetchingPrice ? (
                                                 <ActivityIndicator size="small" color={Colors.primary} className="mt-1" style={{ alignSelf: 'flex-start' }} />
                                             ) : (
                                                 <Text className="text-txt text-base font-bold mt-0.5">
                                                     {selectedAssetPrice !== null ? formatRupiah(selectedAssetPrice) : 'Rp 0'}
                                                 </Text>
                                             )}
                                         </View>
                                         {invQty !== '' && selectedAssetPrice !== null && !fetchingPrice && (
                                             <View className="items-end">
                                                 <Text className="text-txt-secondary text-xs font-semibold">Total Estimasi</Text>
                                                 <Text className="text-primary text-base font-extrabold mt-0.5">
                                                     {formatRupiah(Number(invQty) * selectedAssetPrice)}
                                                 </Text>
                                             </View>
                                         )}
                                     </View>
                                 )}

                                <View className="mb-4">
                                    <Text className="text-txt-secondary text-xs font-semibold mb-1.5">Jumlah (Lot / Koin)</Text>
                                    <TextInput
                                        className="bg-input-bg rounded-xl p-3.5 text-txt text-[15px] border border-surface-border"
                                        placeholder="0"
                                        placeholderTextColor={Colors.textMuted}
                                        keyboardType="numeric"
                                        value={invQty}
                                        onChangeText={setInvQty}
                                    />
                                </View>

                                <Dropdown label="Sumber Dana" options={walletOptions} selected={invWallet} onSelect={setInvWallet} />
                            </>
                        )}

                        <TouchableOpacity
                            onPress={handleSave}
                            activeOpacity={0.85}
                            className="bg-primary rounded-[14px] py-4 items-center mt-1"
                            style={{
                                shadowColor: Colors.primary,
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.35,
                                shadowRadius: 12,
                                elevation: 8,
                            }}
                        >
                            <Text className="text-white text-base font-bold">
                                {activeTab === 'cashflow' ? '💾 Simpan Transaksi' : `💾 Simpan ${invType === 'buy' ? 'Pembelian' : 'Penjualan'}`}
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                    </>
                )}
            </KeyboardAvoidingView>
        </Modal>

        <AddWalletModal
            visible={showAddWallet}
            onClose={() => setShowAddWallet(false)}
            onSuccess={() => loadOptions()}
        />
        </>
    );
}
