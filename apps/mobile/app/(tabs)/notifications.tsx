import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { NotificationItem } from '@/src/components/NotificationItem';
import { getInsights, markInsightAsRead } from '@/src/api/insights';
import type { Insight } from '@/src/api/insights';

export default function NotificationsScreen() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInsights();
      setInsights(data);
    } catch (err) {
      // Don't show error, treat empty insights as valid state
      console.error("Error fetching insights:", err);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchInsights();
    }, [])
  );

  const handleMarkAsRead = async (insightId: number) => {
    try {
      await markInsightAsRead(insightId);
      // Update local state to reflect the change
      setInsights((prevInsights) =>
        prevInsights.map((insight) =>
          insight.id === insightId ? { ...insight, isRead: true } : insight
        )
      );
    } catch (err) {
      console.error("Error marking insight as read:", err);
    }
  };

  const unreadCount = insights.filter(i => !i.isRead).length;

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

                {loading ? (
                    <View className="flex-1 justify-center items-center py-10">
                        <ActivityIndicator size="large" color="#6C5CE7" />
                        <Text className="text-txt-secondary text-[13px] mt-3">Memuat notifikasi...</Text>
                    </View>
                ) : insights.length > 0 ? (
                    insights.map(insight => (
                        <NotificationItem
                            key={insight.id}
                            type={insight.type}
                            message={insight.message}
                            isRead={insight.isRead}
                            createdAt={insight.createdAt}
                        />
                    ))
                ) : (
                    <View className="flex-1 justify-center items-center py-10">
                        <Text className="text-txt-secondary text-[13px] text-center">
                            Tidak ada notifikasi saat ini
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
