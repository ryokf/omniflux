import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationItem } from '@/src/components/NotificationItem';
import { INSIGHTS } from '@/src/constants/dummy-data';

export default function NotificationsScreen() {
    const unreadCount = INSIGHTS.filter(i => !i.isRead).length;

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row justify-between items-center mb-5">
                    <Text className="text-txt text-2xl font-extrabold">Notifikasi</Text>
                    {unreadCount > 0 && (
                        <View className="bg-warning/25 px-3 py-1.5 rounded-full">
                            <Text className="text-warning text-xs font-bold">{unreadCount} baru</Text>
                        </View>
                    )}
                </View>

                <View className="flex-row items-center bg-primary/15 rounded-xl p-3.5 mb-5 border border-primary/30">
                    <Text className="text-xl mr-2.5">🤖</Text>
                    <View className="flex-1">
                        <Text className="text-primary-light text-[13px] font-semibold">
                            AI Behavioral Analytics
                        </Text>
                        <Text className="text-txt-secondary text-xs mt-0.5">
                            Saran proaktif berdasarkan pola keuangan Anda
                        </Text>
                    </View>
                </View>

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
