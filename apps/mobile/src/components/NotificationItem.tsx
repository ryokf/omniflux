import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/src/constants/colors';

interface NotificationItemProps {
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    budget_alert: { label: 'Peringatan', color: Colors.warning, icon: '⚠️' },
    investment_opportunity: { label: 'Peluang Investasi', color: Colors.primary, icon: '💡' },
    savings_milestone: { label: 'Pencapaian', color: Colors.profit, icon: '🏆' },
};

export function NotificationItem({ type, message, isRead, createdAt }: NotificationItemProps) {
    const config = TYPE_CONFIG[type] ?? { label: 'Info', color: Colors.textSecondary, icon: 'ℹ️' };
    const timeAgo = getTimeAgo(createdAt);

    return (
        <View
            style={{
                flexDirection: 'row',
                padding: 16,
                backgroundColor: isRead ? Colors.surface : Colors.surfaceElevated,
                borderRadius: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: isRead ? Colors.surfaceBorder : config.color + '40',
            }}
        >
            {/* Icon */}
            <View
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    backgroundColor: config.color + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                }}
            >
                <Text style={{ fontSize: 18 }}>{config.icon}</Text>
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ color: config.color, fontSize: 12, fontWeight: '700' }}>
                        {config.label}
                    </Text>
                    {!isRead && (
                        <View
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: 4,
                                backgroundColor: Colors.primary,
                                marginLeft: 8,
                            }}
                        />
                    )}
                    <Text style={{ color: Colors.textMuted, fontSize: 11, marginLeft: 'auto' }}>
                        {timeAgo}
                    </Text>
                </View>
                <Text
                    style={{
                        color: isRead ? Colors.textSecondary : Colors.textPrimary,
                        fontSize: 14,
                        lineHeight: 20,
                    }}
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
