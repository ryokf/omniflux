import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Card } from '@/src/components/Card';
import { AssetCard } from '@/src/components/AssetCard';
import { InvestmentChart } from '@/src/components/InvestmentChart';
import { formatRupiah } from '@/src/utils/format';
import { getAssets } from '@/src/api/assets';
import { getWallets } from '@/src/api/wallets';
import { apiClient } from '@/src/api/client';
import type { Asset } from '@/src/api/assets';

const ASSET_TYPE_ICONS: Record<string, string> = {
  Crypto: "₿",
  Stock: "📊",
  "Mutual Fund": "📦",
  ETF: "📈",
  Gold: "🏆",
  Currency: "💵",
};

export default function PortfolioScreen() {
  const [netWorthData, setNetWorthData] = useState<{
    totalNetWorth: number;
    cashTotal: number;
    investmentTotal: number;
  }>({ totalNetWorth: 0, cashTotal: 0, investmentTotal: 0 });
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [portfolioDetails, setPortfolioDetails] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch net worth, assets, wallets, and transactions in parallel
      const [netWorthRes, assetsRes, walletsRes, txRes] = await Promise.all([
        apiClient.get('/portfolios/net-worth'),
        getAssets(),
        getWallets(),
        apiClient.get('/transactions'),
      ]);

      const nwData = netWorthRes.data?.data || netWorthRes.data || {};
      const cashBalance = Number(nwData.cashBalance || 0);
      const investmentsValue = Number(nwData.totalInvestmentsValue || 0);
      const totalNW = Number(nwData.totalNetWorth || 0);
      const details = Array.isArray(nwData.portfolioDetails) ? nwData.portfolioDetails : [];

      setNetWorthData({
        totalNetWorth: totalNW || (cashBalance + investmentsValue),
        cashTotal: cashBalance || walletsRes.reduce((s, w) => s + (w.balance || 0), 0) || 0,
        investmentTotal: investmentsValue || 0,
      });

      setPortfolioDetails(details);
      
      // Parse transactions
      const txs = Array.isArray(txRes.data?.data) ? txRes.data.data : (Array.isArray(txRes.data) ? txRes.data : []);
      setTransactions(txs);
      
      // Filter assets and add icons
      const assetsWithIcons = assetsRes.map((asset) => ({
        ...asset,
        icon: ASSET_TYPE_ICONS[asset.assetType] || "💰",
      }));
      
      setAssets(assetsWithIcons);
    } catch (err) {
      // Don't show error message, just log it
      // Empty portfolio is a valid state
      console.error("Error fetching portfolio data:", err);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPortfolioData();
    }, [])
  );

  const netWorth = netWorthData.totalNetWorth;
  const cashTotal = netWorthData.cashTotal;
  const investTotal = netWorthData.investmentTotal;

    const assetTypes = ['Crypto', 'Stock', 'Mutual Fund', 'ETF', 'Gold', 'Currency'] as const;
    const typeLabels: Record<string, string> = {
        Crypto: '₿ Kripto',
        Stock: '📊 Saham',
        'Mutual Fund': '📦 Reksa Dana',
        ETF: '📈 ETF',
        Gold: '🏆 Emas',
        Currency: '💵 Mata Uang',
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

                {loading ? (
                    <View className="flex-1 justify-center items-center py-10">
                        <ActivityIndicator size="large" color="#6C5CE7" />
                        <Text className="text-txt-secondary text-[13px] mt-3">Memuat data portofolio...</Text>
                    </View>
                ) : (
                    <>
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

                        {/* Investment Chart */}
                        {(portfolioDetails.length > 0 || transactions.length > 0) && (
                            <InvestmentChart
                                portfolioDetails={portfolioDetails}
                                transactions={transactions}
                            />
                        )}

                        {/* Assets by Type */}
                        {assetTypes.map(type => {
                            const filteredAssets = assets.filter(a => a.assetType === type);
                            if (filteredAssets.length === 0) return null;
                            return (
                                <View key={type} className="mb-5">
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-txt text-[17px] font-bold">{typeLabels[type]}</Text>
                                        <Text className="text-txt-secondary text-[13px]">{filteredAssets.length} aset</Text>
                                    </View>
                                    {filteredAssets.map(asset => (
                                        <AssetCard
                                            key={asset.id}
                                            tickerSymbol={asset.tickerSymbol}
                                            name={asset.name}
                                            assetType={asset.assetType}
                                            totalValue={asset.totalValue}
                                            pnlPercent={asset.pnlPercent || 0}
                                            icon={asset.icon || ASSET_TYPE_ICONS[asset.assetType] || "💰"}
                                            quantity={asset.quantity}
                                        />
                                    ))}
                                </View>
                            );
                        })}

                        {assets.length === 0 && !loading && (
                            <Card className="p-5 border-warning/40">
                                <Text className="text-txt-secondary text-[13px] text-center">
                                    Belum ada aset. Mulai tambahkan aset untuk melacak portofolio Anda.
                                </Text>
                            </Card>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
