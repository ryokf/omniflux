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
    ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { formatRupiah } from '@/src/utils/format';

const WALLETS = [{ id: 1, name: "BCA Utama", balance: 12500000, icon: "🏦" }];
const CATEGORIES = [
  { id: 1, name: "Makanan", type: "expense" as const, icon: "🍔" },
  { id: 5, name: "Belanja", type: "expense" as const, icon: "🛍️" },
  { id: 6, name: "Gaji", type: "income" as const, icon: "💰" }
];

interface AIExtraction {
    amount: number;
    categoryId: number;
    walletId: number;
    description: string;
    confidence: number;
}

interface AIConfirmModalProps {
    visible: boolean;
    rawInput: string;
    onClose: () => void;
    onConfirm: (data: AIExtraction) => void;
}

// Simulates AI extraction from natural language
function simulateAIExtraction(input: string): AIExtraction {
    const lower = input.toLowerCase();

    // Parse amount
    let amount = 0;
    const rbMatch = lower.match(/(\d+)\s*r(?:i)?b/);
    const jtMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*j(?:u)?t/);
    const numMatch = lower.match(/(\d{4,})/);
    if (jtMatch) {
        amount = parseFloat(jtMatch[1].replace(',', '.')) * 1_000_000;
    } else if (rbMatch) {
        amount = parseInt(rbMatch[1]) * 1_000;
    } else if (numMatch) {
        amount = parseInt(numMatch[1]);
    }

    // Guess category
    let categoryId = 5; // default: Belanja
    let confidence = 82;
    if (/makan|warteg|nasi|ayam|bakso|kopi|roti|resto/.test(lower)) {
        categoryId = 1; confidence = 96;
    } else if (/grab|gojek|ojol|bensin|parkir|transportasi|taxi/.test(lower)) {
        categoryId = 2; confidence = 94;
    } else if (/wifi|listrik|air|pdam|tagihan|iuran|sewa/.test(lower)) {
        categoryId = 3; confidence = 98;
    } else if (/nonton|bioskop|game|hiburan|netflix|spotify/.test(lower)) {
        categoryId = 4; confidence = 91;
    } else if (/beli|belanja|baju|sepatu|online/.test(lower)) {
        categoryId = 5; confidence = 87;
    } else if (/gaji|salary/.test(lower)) {
        categoryId = 6; confidence = 99;
    } else if (/freelance|project|klien/.test(lower)) {
        categoryId = 7; confidence = 93;
    }

    // Default wallet
    const walletId = 1; // BCA Utama

    return {
        amount,
        categoryId,
        walletId,
        description: input,
        confidence,
    };
}

// Dropdown (reused pattern)
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
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
            </TouchableOpacity>
            {open && (
                <View className="bg-surface-el rounded-xl mt-1 border border-surface-border overflow-hidden">
                    {options.map((opt, idx) => (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() => { onSelect(opt.value); setOpen(false); }}
                            className={`p-3.5 ${idx < options.length - 1 ? 'border-b border-divider' : ''} ${opt.value === selected ? 'bg-primary/15' : ''
                                }`}
                        >
                            <Text className={`text-sm ${opt.value === selected ? 'text-primary-light font-semibold' : 'text-txt'}`}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

export function AIConfirmModal({ visible, rawInput, onClose, onConfirm }: AIConfirmModalProps) {
    const [loading, setLoading] = useState(true);
    const [extraction, setExtraction] = useState<AIExtraction | null>(null);

    // Editable fields
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [walletId, setWalletId] = useState('');
    const [description, setDescription] = useState('');
    const [confidence, setConfidence] = useState(0);

    const walletOptions = WALLETS.map(w => ({ value: String(w.id), label: `${w.icon} ${w.name}` }));
    const categoryOptions = CATEGORIES.map(c => ({ value: String(c.id), label: `${c.icon} ${c.name}` }));

    // Simulate AI processing when modal opens
    useEffect(() => {
        if (visible && rawInput) {
            setLoading(true);
            const timeout = setTimeout(() => {
                const result = simulateAIExtraction(rawInput);
                setExtraction(result);
                setAmount(String(result.amount));
                setCategoryId(String(result.categoryId));
                setWalletId(String(result.walletId));
                setDescription(result.description);
                setConfidence(result.confidence);
                setLoading(false);
            }, 1800); // Simulate AI latency
            return () => clearTimeout(timeout);
        }
    }, [visible, rawInput]);

    const handleConfirm = () => {
        onConfirm({
            amount: parseInt(amount) || 0,
            categoryId: parseInt(categoryId),
            walletId: parseInt(walletId),
            description,
            confidence,
        });
    };

    const category = CATEGORIES.find(c => c.id === parseInt(categoryId));

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable className="flex-1 bg-black/55" onPress={onClose} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl max-h-[90%]"
            >
                {/* Handle */}
                <View className="items-center pt-3 pb-1">
                    <View className="w-10 h-1 rounded-sm bg-txt-muted" />
                </View>

                {loading ? (
                    /* ============ LOADING STATE ============ */
                    <View className="items-center justify-center py-20 px-5">
                        <View className="w-16 h-16 rounded-2xl bg-primary/20 justify-center items-center mb-5">
                            <ActivityIndicator color={Colors.primary} size="large" />
                        </View>
                        <Text className="text-txt text-lg font-bold mb-2">Menganalisis...</Text>
                        <Text className="text-txt-secondary text-sm text-center">
                            AI sedang mengekstrak data dari{'\n'}"{rawInput}"
                        </Text>
                    </View>
                ) : (
                    /* ============ PRE-FILLED FORM ============ */
                    <>
                        {/* Header */}
                        <View className="flex-row justify-between items-center px-5 pt-2 pb-3">
                            <View>
                                <Text className="text-txt text-xl font-extrabold">Konfirmasi AI</Text>
                                <Text className="text-txt-secondary text-xs mt-0.5">Tinjau & edit sebelum menyimpan</Text>
                            </View>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        {/* AI Confidence Badge */}
                        <View className="mx-5 mb-4">
                            <View
                                className={`flex-row items-center p-3 rounded-xl border ${confidence >= 90
                                        ? 'bg-profit/10 border-profit/30'
                                        : 'bg-warning/10 border-warning/30'
                                    }`}
                            >
                                <Text className="text-lg mr-2">{confidence >= 90 ? '✅' : '⚠️'}</Text>
                                <View className="flex-1">
                                    <Text
                                        className={`text-xs font-bold ${confidence >= 90 ? 'text-profit' : 'text-warning'
                                            }`}
                                    >
                                        Keyakinan AI: {confidence}%
                                    </Text>
                                    <Text className="text-txt-secondary text-[11px] mt-0.5">
                                        {confidence >= 90
                                            ? 'AI cukup yakin dengan hasil ekstraksi'
                                            : 'Periksa kembali isian, AI kurang yakin'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Raw input display */}
                        <View className="mx-5 mb-4 bg-surface-el rounded-xl p-3 border border-surface-border">
                            <Text className="text-txt-muted text-[11px] font-semibold mb-1">INPUT ASLI</Text>
                            <Text className="text-txt text-sm italic">"{rawInput}"</Text>
                        </View>

                        <KeyboardAwareScrollView
                            style={{ paddingHorizontal: 20 }}
                            contentContainerStyle={{ paddingBottom: 40 }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            enableOnAndroid={true}
                            extraScrollHeight={20}
                        >
                            {/* Amount */}
                            <View className="mb-4">
                                <Text className="text-txt-secondary text-xs font-semibold mb-1.5">Nominal (Rp)</Text>
                                <TextInput
                                    className="bg-input-bg rounded-xl p-3.5 text-txt text-lg font-bold border border-surface-border"
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                />
                                {parseInt(amount) > 0 && (
                                    <Text className="text-txt-muted text-xs mt-1 ml-1">
                                        = {formatRupiah(parseInt(amount) || 0)}
                                    </Text>
                                )}
                            </View>

                            {/* Category */}
                            <Dropdown
                                label="Kategori"
                                options={categoryOptions}
                                selected={categoryId}
                                onSelect={setCategoryId}
                            />

                            {/* Wallet */}
                            <Dropdown
                                label="Dompet"
                                options={walletOptions}
                                selected={walletId}
                                onSelect={setWalletId}
                            />

                            {/* Description */}
                            <View className="mb-5">
                                <Text className="text-txt-secondary text-xs font-semibold mb-1.5">Catatan</Text>
                                <TextInput
                                    className="bg-input-bg rounded-xl p-3.5 text-txt text-[15px] border border-surface-border"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>

                            {/* Confirm Button */}
                            <TouchableOpacity
                                onPress={handleConfirm}
                                activeOpacity={0.85}
                                className="bg-primary rounded-[14px] py-4 items-center"
                                style={{
                                    shadowColor: Colors.primary,
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.35,
                                    shadowRadius: 12,
                                    elevation: 8,
                                }}
                            >
                                <Text className="text-white text-base font-bold">✅ Konfirmasi & Simpan</Text>
                            </TouchableOpacity>

                            {/* Cancel link */}
                            <TouchableOpacity onPress={onClose} className="items-center mt-3 py-2">
                                <Text className="text-txt-muted text-sm">Batalkan</Text>
                            </TouchableOpacity>
                        </KeyboardAwareScrollView>
                    </>
                )}
            </KeyboardAvoidingView>
        </Modal>
    );
}
