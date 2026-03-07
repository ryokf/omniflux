import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/colors';
import { Card } from '@/src/components/Card';
import { TransactionItem } from '@/src/components/TransactionItem';
import {
    USER_PROFILE,
    WALLETS,
    TRANSACTIONS,
    formatRupiah,
    getTotalNetWorth,
    getExpenseByCategory,
} from '@/src/constants/dummy-data';

export default function DashboardScreen() {
    const netWorth = getTotalNetWorth();
    const expenses = getExpenseByCategory();
    const recentTx = TRANSACTIONS.slice(0, 5);
    const totalExpense = expenses.reduce((s, e) => s + e.total, 0);

    const barColors = [Colors.primary, Colors.secondary, Colors.profit, Colors.warning, Colors.loss];

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-txt-secondary text-sm">Selamat datang 👋</Text>
                        <Text className="text-txt text-[22px] font-extrabold mt-0.5">
                            {USER_PROFILE.name}
                        </Text>
                    </View>
                    <View className="w-11 h-11 rounded-[14px] bg-primary/30 justify-center items-center">
                        <Text className="text-xl">👤</Text>
                    </View>
                </View>

                {/* Net Worth Card */}
                <Card className="mb-5 border-primary/40">
                    <Text className="text-txt-secondary text-[13px] font-medium">
                        Total Kekayaan Bersih
                    </Text>
                    <Text className="text-txt text-[32px] font-extrabold mt-1.5 tracking-wide">
                        {formatRupiah(netWorth)}
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <View className="bg-profit/20 px-2.5 py-1 rounded-lg">
                            <Text className="text-profit text-[13px] font-bold">▲ 3.2% bulan ini</Text>
                        </View>
                    </View>
                </Card>

                {/* Wallets */}
                <Text className="text-txt text-[17px] font-bold mb-3">Sumber Dana</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-6"
                    contentContainerStyle={{ gap: 12 }}
                >
                    {WALLETS.map(wallet => (
                        <Card key={wallet.id} elevated style={{ width: 160 }}>
                            <Text className="text-2xl mb-2">{wallet.icon}</Text>
                            <Text className="text-txt-secondary text-xs">{wallet.name}</Text>
                            <Text className="text-txt text-[17px] font-bold mt-1">
                                {formatRupiah(wallet.balance)}
                            </Text>
                        </Card>
                    ))}
                </ScrollView>

                {/* Expense Breakdown */}
                <Text className="text-txt text-[17px] font-bold mb-3">Ringkasan Pengeluaran</Text>
                <Card className="mb-6">
                    {expenses.map((cat, i) => {
                        const pct = totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0;
                        const barColor = barColors[i % barColors.length];
                        return (
                            <View key={cat.name} className={i < expenses.length - 1 ? 'mb-3.5' : ''}>
                                <View className="flex-row justify-between mb-1.5">
                                    <Text className="text-txt text-sm font-medium">{cat.name}</Text>
                                    <Text className="text-txt-secondary text-[13px]">{formatRupiah(cat.total)}</Text>
                                </View>
                                <View className="h-1.5 bg-surface-el rounded-full">
                                    <View
                                        className="h-1.5 rounded-full"
                                        style={{
                                            backgroundColor: barColor,
                                            width: `${Math.min(pct, 100)}%`,
                                        }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </Card>

                {/* Recent Transactions */}
                <Text className="text-txt text-[17px] font-bold mb-1">Transaksi Terakhir</Text>
                <Card>
                    {recentTx.map(tx => (
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
        </SafeAreaView>
    );
}
