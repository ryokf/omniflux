import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { Card } from '@/src/components/Card';
import { TransactionItem } from '@/src/components/TransactionItem';
import { AddWalletModal } from '@/src/components/AddWalletModal';
import { apiClient } from '@/src/api/client';
import * as SecureStore from 'expo-secure-store';
import { formatRupiah } from '@/src/utils/format';

export default function DashboardScreen() {
    const [loading, setLoading] = useState(true);
    const [netWorth, setNetWorth] = useState(0);
    const [wallets, setWallets] = useState<any[]>([]);
    const [recentTx, setRecentTx] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<{name: string, total: number}[]>([]);
    const [userName, setUserName] = useState('Pengguna');
    const [showAddWallet, setShowAddWallet] = useState(false);

    const totalExpense = expenses.reduce((s, e) => s + e.total, 0);
    const barColors = [Colors.primary, Colors.secondary, Colors.profit, Colors.warning, Colors.loss];

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const strUserId = await SecureStore.getItemAsync('userId');
            if (!strUserId) return; // User clearly not logged in, just wait.
            
            const [walletsRes, nwRes, txRes, catRes, userRes] = await Promise.all([
                apiClient.get(`/wallets/${strUserId}`),
                apiClient.get('/portfolios/net-worth'),
                apiClient.get('/transactions'),
                apiClient.get('/categories'),
                apiClient.get('/users/me')
            ]);
            
            const wlts = Array.isArray(walletsRes.data?.data) ? walletsRes.data.data : (Array.isArray(walletsRes.data) ? walletsRes.data : []);
            const nw = nwRes.data?.data?.totalNetWorth || nwRes.data?.totalNetWorth || nwRes.data?.data || nwRes.data || 0;
            const txs = Array.isArray(txRes.data?.data) ? txRes.data.data : (Array.isArray(txRes.data) ? txRes.data : []);
            const cats = Array.isArray(catRes.data?.data) ? catRes.data.data : (Array.isArray(catRes.data) ? catRes.data : []);
            const user = userRes.data?.data || userRes.data || {};
            
            setUserName(user.name || user.email?.split('@')[0] || 'Pengguna');
            
            setWallets(wlts.map((w: any) => ({ ...w, balance: Number(w.balance || w.balance_amount || 0) })));
            setNetWorth(Number(nw));
            
            const mappedTxs = txs.map((t: any) => ({ ...t, amount: Number(t.amount || 0) }));
            setRecentTx(mappedTxs.slice(0, 5));
            
            const expTxs = mappedTxs.filter((t: any) => t.amount < 0);
            const map: Record<string, number> = {};
            for (const t of expTxs) {
                const cat = cats.find((c: any) => c.id === (t.category_id || t.categoryId));
                const name = cat?.name ?? "Lainnya";
                map[name] = (map[name] ?? 0) + Math.abs(t.amount);
            }
            setExpenses(Object.entries(map).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total));

        } catch (error: any) {
            console.error('Failed to fetch dashboard data', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDashboardData();
        }, [])
    );

    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('refreshDashboard', () => {
             fetchDashboardData();
        });
        return () => sub.remove();
    }, []);

    if (loading && wallets.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-bg justify-center items-center">
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text className="text-txt-secondary mt-4 font-medium">Memuat data...</Text>
            </SafeAreaView>
        );
    }

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
                            {userName}
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
                {!loading && wallets.length === 0 ? (
                    <TouchableOpacity
                        onPress={() => setShowAddWallet(true)}
                        activeOpacity={0.75}
                        className="mb-6 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/8 py-6 items-center justify-center"
                        style={{
                            shadowColor: Colors.primary,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 10,
                        }}
                    >
                        <View className="w-14 h-14 rounded-2xl bg-primary/20 items-center justify-center mb-3">
                            <Ionicons name="wallet-outline" size={28} color={Colors.primary} />
                        </View>
                        <Text className="text-txt text-[15px] font-bold">Belum ada dompet</Text>
                        <Text className="text-txt-secondary text-[13px] mt-1 mb-3 text-center px-4">
                            Tambahkan dompet pertamamu untuk mulai mencatat keuangan
                        </Text>
                        <View
                            className="flex-row items-center bg-primary rounded-xl px-5 py-2.5"
                            style={{
                                shadowColor: Colors.primary,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={18} color="white" />
                            <Text className="text-white text-[14px] font-bold ml-2">Tambah Dompet</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-6"
                        contentContainerStyle={{ gap: 12 }}
                    >
                        {wallets.map(wallet => (
                            <Card key={wallet.id || wallet.wallet_id} elevated style={{ width: 160 }}>
                                <Text className="text-2xl mb-2">{wallet.icon || '🏦'}</Text>
                                <Text className="text-txt-secondary text-xs">{wallet.name}</Text>
                                <Text className="text-txt text-[17px] font-bold mt-1">
                                    {formatRupiah(wallet.balance)}
                                </Text>
                            </Card>
                        ))}
                    </ScrollView>
                )}

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
                    {recentTx.length === 0 && (
                        <Text className="text-txt-muted text-center py-4 text-sm font-medium">Belum ada transaksi</Text>
                    )}
                    {recentTx.map(tx => (
                        <TransactionItem
                            key={tx.id || tx.transaction_id}
                            description={tx.description}
                            amount={tx.amount}
                            categoryId={tx.category_id || tx.categoryId}
                            date={tx.date || tx.createdAt || tx.created_at}
                            aiConfidence={tx.aiConfidence || tx.ai_confidence}
                        />
                    ))}
                </Card>
            </ScrollView>

            <AddWalletModal
                visible={showAddWallet}
                onClose={() => setShowAddWallet(false)}
                onSuccess={() => fetchDashboardData()}
            />
        </SafeAreaView>
    );
}
