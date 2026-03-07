import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { formatRupiah } from '@/src/constants/dummy-data';

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
            style={{
                backgroundColor: Colors.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: Colors.surfaceBorder,
                marginBottom: 12,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Icon */}
                <View
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        backgroundColor: Colors.surfaceElevated,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 14,
                    }}
                >
                    <Text style={{ fontSize: 22 }}>{icon}</Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: '700' }}>
                            {tickerSymbol}
                        </Text>
                        <View
                            style={{
                                marginLeft: 8,
                                backgroundColor: Colors.primary + '20',
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ color: Colors.primaryLight, fontSize: 10, fontWeight: '600' }}>
                                {assetType}
                            </Text>
                        </View>
                    </View>
                    <Text
                        style={{ color: Colors.textSecondary, fontSize: 13, marginTop: 2 }}
                        numberOfLines={1}
                    >
                        {name}
                    </Text>
                </View>

                {/* Value & PnL */}
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: Colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                        {formatRupiah(totalValue)}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 3,
                            backgroundColor: (isProfit ? Colors.profit : Colors.loss) + '18',
                            paddingHorizontal: 7,
                            paddingVertical: 2,
                            borderRadius: 6,
                        }}
                    >
                        <Text
                            style={{
                                color: isProfit ? Colors.profit : Colors.loss,
                                fontSize: 12,
                                fontWeight: '700',
                            }}
                        >
                            {isProfit ? '▲' : '▼'} {Math.abs(pnlPercent).toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
