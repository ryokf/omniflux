import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/colors';
import { NotificationItem } from '@/src/components/NotificationItem';
import { INSIGHTS } from '@/src/constants/dummy-data';

export default function NotificationsScreen() {
    const unreadCount = INSIGHTS.filter(i => !i.isRead).length;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: '800' }}>
                        Notifikasi
                    </Text>
                    {unreadCount > 0 && (
                        <View
                            style={{
                                backgroundColor: Colors.warning + '25',
                                paddingHorizontal: 12,
                                paddingVertical: 5,
                                borderRadius: 20,
                            }}
                        >
                            <Text style={{ color: Colors.warning, fontSize: 12, fontWeight: '700' }}>
                                {unreadCount} baru
                            </Text>
                        </View>
                    )}
                </View>

                {/* AI Insights Info */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: Colors.primary + '15',
                        borderRadius: 12,
                        padding: 14,
                        marginBottom: 20,
                        borderWidth: 1,
                        borderColor: Colors.primary + '30',
                    }}
                >
                    <Text style={{ fontSize: 20, marginRight: 10 }}>🤖</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: Colors.primaryLight, fontSize: 13, fontWeight: '600' }}>
                            AI Behavioral Analytics
                        </Text>
                        <Text style={{ color: Colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                            Saran proaktif berdasarkan pola keuangan Anda
                        </Text>
                    </View>
                </View>

                {/* Notification Items */}
                {INSIGHTS.map(insight => (
                    <NotificationItem
                        key={insight.id}
                        type={insight.type}
                        message={insight.message}
                        isRead={insight.isRead}
                        createdAt={insight.createdAt}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
