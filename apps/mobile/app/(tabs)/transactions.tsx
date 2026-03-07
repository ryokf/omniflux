import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { Card } from '@/src/components/Card';
import { TransactionItem } from '@/src/components/TransactionItem';
import { ManualInputModal } from '@/src/components/ManualInputModal';
import {
    TRANSACTIONS,
    getExpenseByCategory,
    formatRupiah,
} from '@/src/constants/dummy-data';

export default function TransactionsScreen() {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const expenses = getExpenseByCategory();
    const totalExpense = expenses.reduce((s, e) => s + e.total, 0);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setInputText('');
        }, 2000);
    };

    // Donut segments
    const colors = [Colors.primary, Colors.secondary, Colors.profit, Colors.warning, Colors.loss];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 20 }}>
                    Transaksi
                </Text>

                {/* Smart Input */}
                <Card style={{ marginBottom: 24, borderColor: Colors.primary + '40' }}>
                    <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 10 }}>
                        ✨ AI Smart Input
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={{
                                flex: 1,
                                backgroundColor: Colors.inputBg,
                                borderRadius: 12,
                                padding: 14,
                                paddingRight: 48,
                                color: Colors.textPrimary,
                                fontSize: 15,
                                borderWidth: 1,
                                borderColor: Colors.surfaceBorder,
                            }}
                            placeholder='Cth: "Bayar WiFi 300rb"'
                            placeholderTextColor={Colors.textMuted}
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={handleSend}
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            style={{
                                position: 'absolute',
                                right: 6,
                                width: 38,
                                height: 38,
                                borderRadius: 10,
                                backgroundColor: Colors.primary,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {isProcessing ? (
                                <ActivityIndicator color={Colors.white} size="small" />
                            ) : (
                                <Ionicons name="send" size={16} color={Colors.white} />
                            )}
                        </TouchableOpacity>
                    </View>
                    {isProcessing && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <ActivityIndicator color={Colors.primary} size="small" />
                            <Text style={{ color: Colors.primary, fontSize: 12, marginLeft: 8 }}>
                                Menganalisis dengan AI...
                            </Text>
                        </View>
                    )}
                </Card>

                {/* Manual Input Button */}
                <TouchableOpacity
                    onPress={() => setShowManual(true)}
                    activeOpacity={0.7}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.surfaceElevated,
                        borderRadius: 12,
                        paddingVertical: 12,
                        marginBottom: 24,
                        borderWidth: 1,
                        borderColor: Colors.surfaceBorder,
                        borderStyle: 'dashed',
                    }}
                >
                    <Ionicons name="create-outline" size={16} color={Colors.textSecondary} />
                    <Text style={{ color: Colors.textSecondary, fontSize: 13, fontWeight: '600', marginLeft: 6 }}>
                        ✏️ Input Manual / Form Standar
                    </Text>
                </TouchableOpacity>

                {/* Category Chart (Simplified visual) */}
                <Text style={{ color: Colors.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 12 }}>
                    Proporsi Pengeluaran
                </Text>
                <Card style={{ marginBottom: 24, alignItems: 'center' }}>
                    {/* Visual Donut Representation */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                borderWidth: 12,
                                borderColor: Colors.primary,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 20,
                            }}
                        >
                            <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: '700' }}>
                                {formatRupiah(totalExpense)}
                            </Text>
                            <Text style={{ color: Colors.textSecondary, fontSize: 10 }}>Total</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            {expenses.slice(0, 4).map((cat, i) => (
                                <View key={cat.name} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 3,
                                            backgroundColor: colors[i % colors.length],
                                            marginRight: 8,
                                        }}
                                    />
                                    <Text style={{ color: Colors.textSecondary, fontSize: 12, flex: 1 }}>{cat.name}</Text>
                                    <Text style={{ color: Colors.textPrimary, fontSize: 12, fontWeight: '600' }}>
                                        {((cat.total / totalExpense) * 100).toFixed(0)}%
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </Card>

                {/* Transaction History */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ color: Colors.textPrimary, fontSize: 17, fontWeight: '700' }}>
                        Riwayat Transaksi
                    </Text>
                    <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: '600' }}>
                        {TRANSACTIONS.length} transaksi
                    </Text>
                </View>
                <Card>
                    {TRANSACTIONS.map(tx => (
                        <TransactionItem
                            key={tx.id}
                            description={tx.description}
                            amount={tx.amount}
                            categoryId={tx.categoryId}
                            date={tx.date}
                            aiConfidence={tx.aiConfidence}
                        />
                    ))}
                </Card>
            </ScrollView>

            <ManualInputModal
                visible={showManual}
                onClose={() => setShowManual(false)}
            />
        </SafeAreaView>
    );
}
