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

// Custom Dropdown
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
        <View style={{ marginBottom: 16 }}>
            <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                {label}
            </Text>
            <TouchableOpacity
                onPress={() => setOpen(!open)}
                activeOpacity={0.7}
                style={{
                    backgroundColor: Colors.inputBg,
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: open ? Colors.primary + '60' : Colors.surfaceBorder,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: selectedOption ? Colors.textPrimary : Colors.textMuted, fontSize: 15 }}>
                    {selectedOption?.label ?? 'Pilih...'}
                </Text>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.textMuted}
                />
            </TouchableOpacity>
            {open && (
                <View
                    style={{
                        backgroundColor: Colors.surfaceElevated,
                        borderRadius: 12,
                        marginTop: 4,
                        borderWidth: 1,
                        borderColor: Colors.surfaceBorder,
                        overflow: 'hidden',
                    }}
                >
                    {options.map((opt, idx) => (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() => {
                                onSelect(opt.value);
                                setOpen(false);
                            }}
                            style={{
                                padding: 14,
                                borderBottomWidth: idx < options.length - 1 ? 1 : 0,
                                borderBottomColor: Colors.divider,
                                backgroundColor: opt.value === selected ? Colors.primary + '15' : 'transparent',
                            }}
                        >
                            <Text
                                style={{
                                    color: opt.value === selected ? Colors.primaryLight : Colors.textPrimary,
                                    fontSize: 14,
                                    fontWeight: opt.value === selected ? '600' : '400',
                                }}
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

// Toggle button for Buy/Sell
function ToggleButton({
    value,
    onChange,
}: {
    value: TxType;
    onChange: (v: TxType) => void;
}) {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Tipe Transaksi
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.inputBg,
                    borderRadius: 12,
                    padding: 4,
                    borderWidth: 1,
                    borderColor: Colors.surfaceBorder,
                }}
            >
                <TouchableOpacity
                    onPress={() => onChange('buy')}
                    style={{
                        flex: 1,
                        paddingVertical: 11,
                        borderRadius: 9,
                        backgroundColor: value === 'buy' ? Colors.profit + '25' : 'transparent',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: value === 'buy' ? Colors.profit : Colors.textMuted,
                            fontWeight: '700',
                            fontSize: 14,
                        }}
                    >
                        🟢 Beli
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onChange('sell')}
                    style={{
                        flex: 1,
                        paddingVertical: 11,
                        borderRadius: 9,
                        backgroundColor: value === 'sell' ? Colors.loss + '25' : 'transparent',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: value === 'sell' ? Colors.loss : Colors.textMuted,
                            fontWeight: '700',
                            fontSize: 14,
                        }}
                    >
                        🔴 Jual
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export function ManualInputModal({ visible, onClose }: ManualInputModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('cashflow');

    // -- Arus Kas state --
    const [cfWallet, setCfWallet] = useState('');
    const [cfCategory, setCfCategory] = useState('');
    const [cfAmount, setCfAmount] = useState('');
    const [cfNote, setCfNote] = useState('');

    // -- Investasi state --
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
        // Prototype — just close
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}
                onPress={onClose}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: Colors.surface,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    maxHeight: '88%',
                }}
            >
                {/* Handle */}
                <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
                    <View
                        style={{
                            width: 40,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: Colors.textMuted,
                        }}
                    />
                </View>

                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
                    <Text style={{ color: Colors.textPrimary, fontSize: 20, fontWeight: '800' }}>
                        Input Manual
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 20,
                        backgroundColor: Colors.inputBg,
                        borderRadius: 12,
                        padding: 4,
                        marginBottom: 20,
                        borderWidth: 1,
                        borderColor: Colors.surfaceBorder,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setActiveTab('cashflow')}
                        style={{
                            flex: 1,
                            paddingVertical: 10,
                            borderRadius: 9,
                            backgroundColor: activeTab === 'cashflow' ? Colors.primary : 'transparent',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: activeTab === 'cashflow' ? Colors.white : Colors.textSecondary,
                                fontWeight: '700',
                                fontSize: 13,
                            }}
                        >
                            💸 Arus Kas
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('investment')}
                        style={{
                            flex: 1,
                            paddingVertical: 10,
                            borderRadius: 9,
                            backgroundColor: activeTab === 'investment' ? Colors.primary : 'transparent',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: activeTab === 'investment' ? Colors.white : Colors.textSecondary,
                                fontWeight: '700',
                                fontSize: 13,
                            }}
                        >
                            📈 Investasi
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={{ paddingHorizontal: 20 }}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {activeTab === 'cashflow' ? (
                        /* ============ ARUS KAS FORM ============ */
                        <>
                            <Dropdown
                                label="Dompet"
                                options={walletOptions}
                                selected={cfWallet}
                                onSelect={setCfWallet}
                            />
                            <Dropdown
                                label="Kategori"
                                options={categoryOptions}
                                selected={cfCategory}
                                onSelect={setCfCategory}
                            />

                            {/* Amount */}
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                                    Nominal (Rp)
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: Colors.inputBg,
                                        borderRadius: 12,
                                        padding: 14,
                                        color: Colors.textPrimary,
                                        fontSize: 15,
                                        borderWidth: 1,
                                        borderColor: Colors.surfaceBorder,
                                    }}
                                    placeholder="0"
                                    placeholderTextColor={Colors.textMuted}
                                    keyboardType="numeric"
                                    value={cfAmount}
                                    onChangeText={setCfAmount}
                                />
                            </View>

                            {/* Note */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                                    Catatan
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: Colors.inputBg,
                                        borderRadius: 12,
                                        padding: 14,
                                        color: Colors.textPrimary,
                                        fontSize: 15,
                                        borderWidth: 1,
                                        borderColor: Colors.surfaceBorder,
                                    }}
                                    placeholder="Deskripsi singkat..."
                                    placeholderTextColor={Colors.textMuted}
                                    value={cfNote}
                                    onChangeText={setCfNote}
                                />
                            </View>
                        </>
                    ) : (
                        /* ============ INVESTASI FORM ============ */
                        <>
                            <ToggleButton value={invType} onChange={setInvType} />

                            <Dropdown
                                label="Jenis Aset"
                                options={assetTypeOptions}
                                selected={invAssetType}
                                onSelect={(v) => {
                                    setInvAssetType(v);
                                    setInvSymbol('');  // reset symbol on type change
                                }}
                            />

                            {invAssetType !== '' && (
                                <Dropdown
                                    label="Simbol Aset"
                                    options={symbolOptions}
                                    selected={invSymbol}
                                    onSelect={setInvSymbol}
                                />
                            )}

                            {/* Quantity */}
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                                    Jumlah (Lot / Koin)
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: Colors.inputBg,
                                        borderRadius: 12,
                                        padding: 14,
                                        color: Colors.textPrimary,
                                        fontSize: 15,
                                        borderWidth: 1,
                                        borderColor: Colors.surfaceBorder,
                                    }}
                                    placeholder="0"
                                    placeholderTextColor={Colors.textMuted}
                                    keyboardType="numeric"
                                    value={invQty}
                                    onChangeText={setInvQty}
                                />
                            </View>

                            {/* Price */}
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                                    Harga {invType === 'buy' ? 'Beli' : 'Jual'} (Rp)
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: Colors.inputBg,
                                        borderRadius: 12,
                                        padding: 14,
                                        color: Colors.textPrimary,
                                        fontSize: 15,
                                        borderWidth: 1,
                                        borderColor: Colors.surfaceBorder,
                                    }}
                                    placeholder="0"
                                    placeholderTextColor={Colors.textMuted}
                                    keyboardType="numeric"
                                    value={invPrice}
                                    onChangeText={setInvPrice}
                                />
                            </View>

                            <Dropdown
                                label="Sumber Dana"
                                options={walletOptions}
                                selected={invWallet}
                                onSelect={setInvWallet}
                            />
                        </>
                    )}

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        activeOpacity={0.85}
                        style={{
                            backgroundColor: Colors.primary,
                            borderRadius: 14,
                            paddingVertical: 16,
                            alignItems: 'center',
                            shadowColor: Colors.primary,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.35,
                            shadowRadius: 12,
                            elevation: 8,
                            marginTop: 4,
                        }}
                    >
                        <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700' }}>
                            {activeTab === 'cashflow' ? '💾 Simpan Transaksi' : `💾 Simpan ${invType === 'buy' ? 'Pembelian' : 'Penjualan'}`}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
