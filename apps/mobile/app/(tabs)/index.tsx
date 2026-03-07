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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <View>
                        <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>Selamat datang 👋</Text>
                        <Text style={{ color: Colors.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 2 }}>
                            {USER_PROFILE.name}
                        </Text>
                    </View>
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            backgroundColor: Colors.primary + '30',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 20 }}>👤</Text>
                    </View>
                </View>

                {/* Net Worth Card */}
                <Card
                    style={{
                        marginBottom: 20,
                        borderColor: Colors.primary + '40',
                    }}
                >
                    <Text style={{ color: Colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
                        Total Kekayaan Bersih
                    </Text>
                    <Text
                        style={{
                            color: Colors.textPrimary,
                            fontSize: 32,
                            fontWeight: '800',
                            marginTop: 6,
                            letterSpacing: 0.5,
                        }}
                    >
                        {formatRupiah(netWorth)}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <View
                            style={{
                                backgroundColor: Colors.profit + '20',
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 8,
                            }}
                        >
                            <Text style={{ color: Colors.profit, fontSize: 13, fontWeight: '700' }}>
                                ▲ 3.2% bulan ini
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Wallets */}
                <Text style={{ color: Colors.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 12 }}>
                    Sumber Dana
                </Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 24 }}
                    contentContainerStyle={{ gap: 12 }}
                >
                    {WALLETS.map(wallet => (
                        <Card key={wallet.id} style={{ width: 160 }} elevated>
                            <Text style={{ fontSize: 24, marginBottom: 8 }}>{wallet.icon}</Text>
                            <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{wallet.name}</Text>
                            <Text style={{ color: Colors.textPrimary, fontSize: 17, fontWeight: '700', marginTop: 4 }}>
                                {formatRupiah(wallet.balance)}
                            </Text>
                        </Card>
                    ))}
                </ScrollView>

                {/* Expense Breakdown */}
                <Text style={{ color: Colors.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 12 }}>
                    Ringkasan Pengeluaran
                </Text>
                <Card style={{ marginBottom: 24 }}>
                    {expenses.map((cat, i) => {
                        const pct = totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0;
                        const barColors = [Colors.primary, Colors.secondary, Colors.profit, Colors.warning, Colors.loss];
                        const barColor = barColors[i % barColors.length];
                        return (
                            <View key={cat.name} style={{ marginBottom: i < expenses.length - 1 ? 14 : 0 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: '500' }}>{cat.name}</Text>
                                    <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>{formatRupiah(cat.total)}</Text>
                                </View>
                                <View style={{ height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3 }}>
                                    <View
                                        style={{
                                            height: 6,
                                            backgroundColor: barColor,
                                            borderRadius: 3,
                                            width: `${Math.min(pct, 100)}%`,
                                        }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </Card>

                {/* Recent Transactions */}
                <Text style={{ color: Colors.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 4 }}>
                    Transaksi Terakhir
                </Text>
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
