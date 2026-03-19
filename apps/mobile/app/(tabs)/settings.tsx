import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/src/constants/colors';
import { Card } from '@/src/components/Card';
import { getCurrentUser } from '@/src/api/users';
import * as SecureStore from "expo-secure-store";
import type { UserProfile } from '@/src/api/users';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingRow {
    icon: IoniconsName;
    label: string;
    subtitle?: string;
    isDestructive?: boolean;
}

const SETTINGS_SECTIONS: { title: string; items: SettingRow[] }[] = [
    {
        title: 'Akun',
        items: [
            { icon: 'person-outline', label: 'Profil', subtitle: 'Kelola informasi akun' },
            { icon: 'shield-checkmark-outline', label: 'Keamanan', subtitle: 'Kata sandi & autentikasi' },
            { icon: 'wallet-outline', label: 'Dompet', subtitle: 'Kelola sumber dana' },
        ],
    },
    {
        title: 'Preferensi',
        items: [
            { icon: 'notifications-outline', label: 'Notifikasi', subtitle: 'Kelola saran AI & peringatan' },
            { icon: 'color-palette-outline', label: 'Tampilan', subtitle: 'Tema & bahasa' },
            { icon: 'lock-closed-outline', label: 'Privasi', subtitle: 'Enkripsi & visibilitas data' },
        ],
    },
    {
        title: 'Lainnya',
        items: [
            { icon: 'help-circle-outline', label: 'Bantuan', subtitle: 'FAQ & hubungi kami' },
            { icon: 'information-circle-outline', label: 'Tentang', subtitle: 'OmniFlux v1.0.0' },
            { icon: 'log-out-outline', label: 'Keluar', isDestructive: true },
        ],
    },
];

export default function SettingsScreen() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = await getCurrentUser();
            if (user) {
                setUserProfile(user);
            }
        } catch (err) {
            // Don't show error if profile fails to load
            console.error("Error fetching user profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserProfile();
        }, [])
    );

    const handleLogout = async () => {
        try {
            // Clear the stored token
            await SecureStore.deleteItemAsync("userToken");
            router.replace('/');
        } catch (err) {
            console.error("Error during logout:", err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                <Text className="text-txt text-2xl font-extrabold mb-5">Pengaturan</Text>

                {loading ? (
                    <View className="flex-1 justify-center items-center py-10">
                        <ActivityIndicator size="large" color="#6C5CE7" />
                        <Text className="text-txt-secondary text-[13px] mt-3">Memuat profil...</Text>
                    </View>
                ) : userProfile ? (
                    <>
                        <Card className="mb-6 border-primary/40">
                            <View className="flex-row items-center">
                                <View className="w-14 h-14 rounded-2xl bg-primary/30 justify-center items-center mr-3.5">
                                    <Text className="text-[26px]">👤</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-txt text-lg font-bold">{userProfile.name}</Text>
                                    <Text className="text-txt-secondary text-[13px] mt-0.5">{userProfile.email}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                            </View>
                        </Card>

                        {SETTINGS_SECTIONS.map(section => (
                            <View key={section.title} className="mb-6">
                                <Text className="text-txt-secondary text-[13px] font-semibold mb-2.5 ml-1">
                                    {section.title.toUpperCase()}
                                </Text>
                                <Card className="p-0 overflow-hidden">
                                    {section.items.map((item, idx) => (
                                        <TouchableOpacity
                                            key={item.label}
                                            activeOpacity={0.6}
                                            onPress={item.isDestructive ? handleLogout : undefined}
                                            className={`flex-row items-center p-4 ${idx < section.items.length - 1 ? 'border-b border-divider' : ''
                                                }`}
                                        >
                                            <View
                                                className={`w-9 h-9 rounded-[10px] justify-center items-center mr-3 ${item.isDestructive ? 'bg-loss/20' : 'bg-surface-el'
                                                    }`}
                                            >
                                                <Ionicons
                                                    name={item.icon}
                                                    size={18}
                                                    color={item.isDestructive ? Colors.loss : Colors.textSecondary}
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <Text
                                                    className={`text-[15px] font-medium ${item.isDestructive ? 'text-loss' : 'text-txt'
                                                        }`}
                                                >
                                                    {item.label}
                                                </Text>
                                                {item.subtitle && (
                                                    <Text className="text-txt-muted text-xs mt-0.5">{item.subtitle}</Text>
                                                )}
                                            </View>
                                            {!item.isDestructive && (
                                                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </Card>
                            </View>
                        ))}
                    </>
                ) : (
                    <View className="flex-1 justify-center items-center py-10">
                        <Text className="text-txt-secondary text-[13px] text-center">
                            Gagal memuat informasi pengguna
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
