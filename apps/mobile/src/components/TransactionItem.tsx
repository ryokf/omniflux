import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { getCategory, formatCompactRupiah } from '@/src/constants/dummy-data';

interface TransactionItemProps {
    description: string;
    amount: number;
    categoryId: number;
    date: string;
    aiConfidence: number | null;
}

export function TransactionItem({
    description,
    amount,
    categoryId,
    date,
    aiConfidence,
}: TransactionItemProps) {
    const category = getCategory(categoryId);
    const isExpense = amount < 0;
    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
    });

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: Colors.divider,
            }}
        >
            {/* Category Icon */}
            <View
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: Colors.surfaceElevated,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                }}
            >
                <Text style={{ fontSize: 20 }}>{category?.icon ?? '📌'}</Text>
            </View>

            {/* Description & Category */}
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        color: Colors.textPrimary,
                        fontSize: 15,
                        fontWeight: '500',
                    }}
                    numberOfLines={1}
                >
                    {description}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                    <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
                        {category?.name}
                    </Text>
                    {aiConfidence !== null && aiConfidence < 90 && (
                        <View
                            style={{
                                marginLeft: 6,
                                backgroundColor: Colors.warning + '25',
                                paddingHorizontal: 5,
                                paddingVertical: 1,
                                borderRadius: 4,
                            }}
                        >
                            <Text style={{ color: Colors.warning, fontSize: 10, fontWeight: '600' }}>
                                ⚠ AI {aiConfidence}%
                            </Text>
                        </View>
                    )}
                    <Text style={{ color: Colors.textMuted, fontSize: 12, marginLeft: 8 }}>
                        {formattedDate}
                    </Text>
                </View>
            </View>

            {/* Amount */}
            <Text
                style={{
                    color: isExpense ? Colors.loss : Colors.profit,
                    fontSize: 15,
                    fontWeight: '600',
                }}
            >
                {formatCompactRupiah(amount)}
            </Text>
        </View>
    );
}
