import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { WALLETS, CATEGORIES, ASSET_SYMBOLS } from '@/src/constants/dummy-data';

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
    const [invPrice, setInvPrice] = useState('');
    const [invWallet, setInvWallet] = useState('');

    const walletOptions = WALLETS.map(w => ({ value: String(w.id), label: `${w.icon} ${w.name}` }));
    const categoryOptions = CATEGORIES.map(c => ({ value: String(c.id), label: `${c.icon} ${c.name}` }));
    const assetTypeOptions = [
        { value: 'Crypto', label: '₿ Kripto' },
        { value: 'Stock', label: '📊 Saham' },
        { value: 'Mutual Fund', label: '📦 Reksa Dana' },
    ];
    const symbolOptions = (ASSET_SYMBOLS[invAssetType] ?? []).map(a => ({
        value: a.symbol,
        label: `${a.symbol} — ${a.name}`,
    }));

    const resetForm = () => {
        setCfWallet(''); setCfCategory(''); setCfAmount(''); setCfNote('');
        setInvType('buy'); setInvAssetType(''); setInvSymbol('');
        setInvQty(''); setInvPrice(''); setInvWallet('');
    };

    const handleSave = () => {
        resetForm();
        onClose();
    };

    return (
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

                <ScrollView
                    className="px-5"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
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
                            <ToggleButton value={invType} onChange={setInvType} />
                            <Dropdown
                                label="Jenis Aset"
                                options={assetTypeOptions}
                                selected={invAssetType}
                                onSelect={(v) => { setInvAssetType(v); setInvSymbol(''); }}
                            />
                            {invAssetType !== '' && (
                                <Dropdown label="Simbol Aset" options={symbolOptions} selected={invSymbol} onSelect={setInvSymbol} />
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
                            <View className="mb-4">
                                <Text className="text-txt-secondary text-xs font-semibold mb-1.5">
                                    Harga {invType === 'buy' ? 'Beli' : 'Jual'} (Rp)
                                </Text>
                                <TextInput
                                    className="bg-input-bg rounded-xl p-3.5 text-txt text-[15px] border border-surface-border"
                                    placeholder="0"
                                    placeholderTextColor={Colors.textMuted}
                                    keyboardType="numeric"
                                    value={invPrice}
                                    onChangeText={setInvPrice}
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
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
