import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/colors';
import { Card } from '@/src/components/Card';
import { AssetCard } from '@/src/components/AssetCard';
import {
    PORTFOLIO_ASSETS,
    WALLETS,
    formatRupiah,
    getTotalNetWorth,
} from '@/src/constants/dummy-data';

export default function PortfolioScreen() {
    const netWorth = getTotalNetWorth();
    const cashTotal = WALLETS.reduce((s, w) => s + w.balance, 0);
    const investTotal = PORTFOLIO_ASSETS.reduce((s, a) => s + a.totalValue, 0);

    const assetTypes = ['Crypto', 'Stock', 'Mutual Fund'] as const;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 20 }}>
                    Portofolio
                </Text>

                {/* Net Worth */}
                <Card style={{ marginBottom: 20, borderColor: Colors.primary + '40' }}>
                    <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>Net Worth</Text>
                    <Text style={{ color: Colors.textPrimary, fontSize: 30, fontWeight: '800', marginTop: 4 }}>
                        {formatRupiah(netWorth)}
                    </Text>

                    {/* Breakdown */}
                    <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colors.surfaceElevated,
                                borderRadius: 12,
                                padding: 12,
                            }}
                        >
                            <Text style={{ color: Colors.textSecondary, fontSize: 11 }}>💵 Kas</Text>
                            <Text style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 4 }}>
                                {formatRupiah(cashTotal)}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colors.surfaceElevated,
                                borderRadius: 12,
                                padding: 12,
                            }}
                        >
                            <Text style={{ color: Colors.textSecondary, fontSize: 11 }}>📊 Investasi</Text>
                            <Text style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 4 }}>
                                {formatRupiah(investTotal)}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Assets by Type */}
                {assetTypes.map(type => {
                    const assets = PORTFOLIO_ASSETS.filter(a => a.assetType === type);
                    if (assets.length === 0) return null;

                    const typeLabels: Record<string, string> = {
                        Crypto: '₿ Kripto',
                        Stock: '📊 Saham',
                        'Mutual Fund': '📦 Reksa Dana',
                    };

                    return (
                        <View key={type} style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <Text style={{ color: Colors.textPrimary, fontSize: 17, fontWeight: '700' }}>
                                    {typeLabels[type]}
                                </Text>
                                <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>
                                    {assets.length} aset
                                </Text>
                            </View>
                            {assets.map(asset => (
                                <AssetCard
                                    key={asset.id}
                                    tickerSymbol={asset.tickerSymbol}
                                    name={asset.name}
                                    assetType={asset.assetType}
                                    totalValue={asset.totalValue}
                                    pnlPercent={asset.pnlPercent}
                                    icon={asset.icon}
                                    quantity={asset.quantity}
                                />
                            ))}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}
