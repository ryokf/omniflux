import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationItem } from '@/src/components/NotificationItem';
const INSIGHTS = [
  { id: 1, type: "budget_alert", message: "Pengeluaran makanan bulan ini sudah 80% dari rata-rata.", isRead: false, createdAt: "2026-03-07T20:00:00Z" },
  { id: 3, type: "savings_milestone", message: "Selamat! Anda berhasil menghemat Rp 1.2 juta dibanding bulan lalu.", isRead: true, createdAt: "2026-03-06T09:00:00Z" }
];

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
