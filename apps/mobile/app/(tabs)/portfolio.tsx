import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    const typeLabels: Record<string, string> = {
        Crypto: '₿ Kripto',
        Stock: '📊 Saham',
        'Mutual Fund': '📦 Reksa Dana',
    };

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text className="text-txt text-2xl font-extrabold mb-5">Portofolio</Text>

                {/* Net Worth */}
                <Card className="mb-5 border-primary/40">
                    <Text className="text-txt-secondary text-[13px]">Net Worth</Text>
                    <Text className="text-txt text-[30px] font-extrabold mt-1">{formatRupiah(netWorth)}</Text>

                    {/* Breakdown */}
                    <View className="flex-row mt-4 gap-3">
                        <View className="flex-1 bg-surface-el rounded-xl p-3">
                            <Text className="text-txt-secondary text-[11px]">💵 Kas</Text>
                            <Text className="text-txt text-base font-bold mt-1">{formatRupiah(cashTotal)}</Text>
                        </View>
                        <View className="flex-1 bg-surface-el rounded-xl p-3">
                            <Text className="text-txt-secondary text-[11px]">📊 Investasi</Text>
                            <Text className="text-txt text-base font-bold mt-1">{formatRupiah(investTotal)}</Text>
                        </View>
                    </View>
                </Card>

                {/* Assets by Type */}
                {assetTypes.map(type => {
                    const assets = PORTFOLIO_ASSETS.filter(a => a.assetType === type);
                    if (assets.length === 0) return null;
                    return (
                        <View key={type} className="mb-5">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-txt text-[17px] font-bold">{typeLabels[type]}</Text>
                                <Text className="text-txt-secondary text-[13px]">{assets.length} aset</Text>
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
