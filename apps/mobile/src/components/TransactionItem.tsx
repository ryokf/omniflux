import React from 'react';
import { View, Text } from 'react-native';
import { getCategoryIcon, formatCompactRupiah } from '@/src/utils/format';

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
    const category = getCategoryIcon(categoryId);
    const isExpense = amount < 0;
    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
    });

    return (
        <View className="flex-row items-center py-3.5 border-b border-divider">
            {/* Category Icon */}
            <View className="w-11 h-11 rounded-xl bg-surface-el justify-center items-center mr-3">
                <Text className="text-xl">{category?.icon ?? '📌'}</Text>
            </View>

            {/* Description & Category */}
            <View className="flex-1">
                <Text className="text-txt text-[15px] font-medium" numberOfLines={1}>
                    {description}
                </Text>
                <View className="flex-row items-center mt-0.5">
                    <Text className="text-txt-secondary text-xs">{category?.name}</Text>
                    {aiConfidence !== null && aiConfidence < 90 && (
                        <View className="ml-1.5 bg-warning/25 px-1.5 py-0.5 rounded">
                            <Text className="text-warning text-[10px] font-semibold">
                                ⚠ AI {aiConfidence}%
                            </Text>
                        </View>
                    )}
                    <Text className="text-txt-muted text-xs ml-2">{formattedDate}</Text>
                </View>
            </View>

            {/* Amount */}
            <Text
                className={`text-[15px] font-semibold ${isExpense ? 'text-loss' : 'text-profit'}`}
            >
                {formatCompactRupiah(amount)}
            </Text>
        </View>
    );
}
