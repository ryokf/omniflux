import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { Card } from '@/src/components/Card';
import { TransactionItem } from '@/src/components/TransactionItem';
import { ManualInputModal } from '@/src/components/ManualInputModal';
import { AIConfirmModal } from '@/src/components/AIConfirmModal';
import { formatRupiah } from '@/src/utils/format';
import { apiClient } from '@/src/api/client';
import { useFocusEffect } from 'expo-router';

export default function TransactionsScreen() {
    const [inputText, setInputText] = useState('');
    const [showManual, setShowManual] = useState(false);
    const [showAIConfirm, setShowAIConfirm] = useState(false);
    const [pendingInput, setPendingInput] = useState('');
    
    const [transactions, setTransactions] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [txRes, catRes] = await Promise.all([
                apiClient.get('/transactions'),
                apiClient.get('/categories')
            ]);
            const txs = Array.isArray(txRes.data?.data) ? txRes.data.data : (Array.isArray(txRes.data) ? txRes.data : []);
            const cats = Array.isArray(catRes.data?.data) ? catRes.data.data : (Array.isArray(catRes.data) ? catRes.data : []);
            setTransactions(txs.map((t: any) => ({ ...t, amount: Number(t.amount || 0) })));
            setCategories(cats);
        } catch (e: any) {
            console.error("Failed to load transactions", e.response?.data || e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => { loadData(); }, []));

    const expensesMap = transactions.filter(t => t.amount < 0).reduce((map, t) => {
        const cat = categories.find(c => c.id === (t.category_id || t.categoryId));
        const name = cat?.name ?? "Lainnya";
        map[name] = (map[name] || 0) + Math.abs(t.amount);
        return map;
    }, {} as Record<string, number>);
    
    const expenses = Object.entries(expensesMap).map(([name, total]) => ({name: String(name), total: Number(total)})).sort((a: {total: number}, b: {total: number}) => b.total - a.total);
    const totalExpense = expenses.reduce((s, e) => s + e.total, 0);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setPendingInput(inputText.trim());
        setInputText('');
        setShowAIConfirm(true);
    };

    const handleAIConfirm = () => {
        setShowAIConfirm(false);
        setPendingInput('');
        loadData(); // refresh data
    };

    const legendColors = [Colors.primary, Colors.secondary, Colors.profit, Colors.warning, Colors.loss];

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text className="text-txt text-2xl font-extrabold mb-5">Transaksi</Text>

                {/* Smart Input */}
                <Card className="mb-3 border-primary/40">
                    <Text className="text-txt-secondary text-xs font-semibold mb-2.5">✨ AI Smart Input</Text>
                    <View className="flex-row items-center">
                        <TextInput
                            className="flex-1 bg-input-bg rounded-xl p-3.5 pr-12 text-txt text-[15px] border border-surface-border"
                            placeholder='Cth: "Bayar WiFi 300rb"'
                            placeholderTextColor={Colors.textMuted}
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={handleSend}
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            className="absolute right-1.5 w-[38px] h-[38px] rounded-[10px] bg-primary justify-center items-center"
                        >
                            <Ionicons name="send" size={16} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-txt-muted text-[11px] mt-2">
                        Ketik transaksi dalam bahasa sehari-hari, AI akan mengekstrak datanya
                    </Text>
                </Card>

                {/* Manual Input Button */}
                <TouchableOpacity
                    onPress={() => setShowManual(true)}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-center bg-surface-el rounded-xl py-3 mb-6 border border-dashed border-surface-border"
                >
                    <Ionicons name="create-outline" size={16} color={Colors.textSecondary} />
                    <Text className="text-txt-secondary text-[13px] font-semibold ml-1.5">
                        ✏️ Input Manual / Form Standar
                    </Text>
                </TouchableOpacity>

                {/* Category Chart */}
                <Text className="text-txt text-[17px] font-bold mb-3">Proporsi Pengeluaran</Text>
                <Card className="mb-6 items-center">
                    <View className="mb-4">
                        <View className="w-[180px] h-[180px] rounded-full border-[14px] border-primary justify-center items-center mr-5">
                            <Text className="text-txt text-lg font-bold">{formatRupiah(totalExpense)}</Text>
                            <Text className="text-txt-secondary">Total</Text>
                        </View>
                        <View className="mt-4">
                            {expenses.slice(0, 4).map((cat, i) => (
                                <View key={cat.name} className="flex-row items-center mb-2">
                                    <View
                                        className="w-2.5 h-2.5 rounded-sm mr-2"
                                        style={{ backgroundColor: legendColors[i % legendColors.length] }}
                                    />
                                    <Text className="text-txt-secondary flex-1">{cat.name}</Text>
                                    <Text className="text-txt font-semibold">
                                        {totalExpense > 0 ? ((cat.total / totalExpense) * 100).toFixed(0) : 0}%
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </Card>

                {/* Transaction History */}
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-txt text-[17px] font-bold">Riwayat Transaksi</Text>
                    <Text className="text-primary text-[13px] font-semibold">{transactions.length} transaksi</Text>
                </View>
                <Card>
                    {isLoading ? (
                        <ActivityIndicator size="small" color={Colors.primary} className="py-4" />
                    ) : transactions.length === 0 ? (
                        <Text className="text-txt-muted text-center py-4 text-sm font-medium">Belum ada transaksi</Text>
                    ) : (
                        transactions.map(tx => (
                            <TransactionItem
                                key={tx.id || tx.transaction_id}
                                description={tx.description}
                                amount={tx.amount}
                                categoryId={tx.category_id || tx.categoryId}
                                date={tx.date || tx.createdAt || tx.transaction_date || tx.created_at}
                                aiConfidence={tx.aiConfidence || tx.ai_confidence}
                            />
                        ))
                    )}
                </Card>
            </ScrollView>

            <ManualInputModal visible={showManual} onClose={() => { setShowManual(false); loadData(); }} />
            <AIConfirmModal
                visible={showAIConfirm}
                rawInput={pendingInput}
                onClose={() => { setShowAIConfirm(false); setPendingInput(''); }}
                onConfirm={handleAIConfirm}
            />
        </SafeAreaView>
    );
}
