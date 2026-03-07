import React from 'react';
import { View, Text } from 'react-native';

interface NotificationItemProps {
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const TYPE_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string; borderClass: string; icon: string }> = {
    budget_alert: {
        label: 'Peringatan',
        colorClass: 'text-warning',
        bgClass: 'bg-warning/20',
        borderClass: 'border-warning/40',
        icon: '⚠️',
    },
    investment_opportunity: {
        label: 'Peluang Investasi',
        colorClass: 'text-primary',
        bgClass: 'bg-primary/20',
        borderClass: 'border-primary/40',
        icon: '💡',
    },
    savings_milestone: {
        label: 'Pencapaian',
        colorClass: 'text-profit',
        bgClass: 'bg-profit/20',
        borderClass: 'border-profit/40',
        icon: '🏆',
    },
};

export function NotificationItem({ type, message, isRead, createdAt }: NotificationItemProps) {
    const config = TYPE_CONFIG[type] ?? {
        label: 'Info',
        colorClass: 'text-txt-secondary',
        bgClass: 'bg-txt-secondary/20',
        borderClass: 'border-txt-secondary/40',
        icon: 'ℹ️',
    };
    const timeAgo = getTimeAgo(createdAt);

    return (
        <View
            className={`flex-row p-4 rounded-[14px] mb-2.5 border ${isRead
                    ? 'bg-surface border-surface-border'
                    : `bg-surface-el ${config.borderClass}`
                }`}
        >
            {/* Icon */}
            <View className={`w-[42px] h-[42px] rounded-xl ${config.bgClass} justify-center items-center mr-3`}>
                <Text className="text-lg">{config.icon}</Text>
            </View>

            {/* Content */}
            <View className="flex-1">
                <View className="flex-row items-center mb-1">
                    <Text className={`text-xs font-bold ${config.colorClass}`}>{config.label}</Text>
                    {!isRead && (
                        <View className="w-[7px] h-[7px] rounded-full bg-primary ml-2" />
                    )}
                    <Text className="text-txt-muted text-[11px] ml-auto">{timeAgo}</Text>
                </View>
                <Text
                    className={`text-sm leading-5 ${isRead ? 'text-txt-secondary' : 'text-txt'}`}
                >
                    {message}
                </Text>
            </View>
        </View>
    );
}

function getTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Baru saja';
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Kemarin';
    return `${days} hari lalu`;
}
