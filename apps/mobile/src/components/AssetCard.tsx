import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatRupiah } from '@/src/utils/format';

interface AssetCardProps {
    tickerSymbol: string;
    name: string;
    assetType: string;
    totalValue: number;
    pnlPercent: number;
    icon: string;
    quantity: number;
}

export function AssetCard({
    tickerSymbol,
    name,
    assetType,
    totalValue,
    pnlPercent,
    icon,
    quantity,
}: AssetCardProps) {
    const isProfit = pnlPercent >= 0;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className="bg-surface rounded-2xl p-4 border border-surface-border mb-3"
        >
            <View className="flex-row items-center">
                {/* Icon */}
                <View className="w-12 h-12 rounded-[14px] bg-surface-el justify-center items-center mr-3.5">
                    <Text className="text-[22px]">{icon}</Text>
                </View>

                {/* Info */}
                <View className="flex-1">
                    <View className="flex-row items-center">
                        <Text className="text-txt text-base font-bold">{tickerSymbol}</Text>
                        <View className="ml-2 bg-primary/20 px-2 py-0.5 rounded-md">
                            <Text className="text-primary-light text-[10px] font-semibold">{assetType}</Text>
                        </View>
                    </View>
                    <Text className="text-txt-secondary text-[13px] mt-0.5" numberOfLines={1}>
                        {name}
                    </Text>
                </View>

                {/* Value & PnL */}
                <View className="items-end">
                    <Text className="text-txt text-[15px] font-semibold">{formatRupiah(totalValue)}</Text>
                    <View
                        className={`flex-row items-center mt-1 px-1.5 py-0.5 rounded-md ${isProfit ? 'bg-profit/10' : 'bg-loss/10'
                            }`}
                    >
                        <Text
                            className={`text-xs font-bold ${isProfit ? 'text-profit' : 'text-loss'}`}
                        >
                            {isProfit ? '▲' : '▼'} {Math.abs(pnlPercent).toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
