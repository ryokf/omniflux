import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/src/constants/colors';
import { Card } from '@/src/components/Card';
import { USER_PROFILE } from '@/src/constants/dummy-data';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingRow {
    icon: IoniconsName;
    label: string;
    subtitle?: string;
    color?: string;
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

    const handleLogout = () => {
        router.replace('/');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 20 }}>
                    Pengaturan
                </Text>

                {/* User Profile Card */}
                <Card style={{ marginBottom: 24, borderColor: Colors.primary + '40' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                backgroundColor: Colors.primary + '30',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 14,
                            }}
                        >
                            <Text style={{ fontSize: 26 }}>👤</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: Colors.textPrimary, fontSize: 18, fontWeight: '700' }}>
                                {USER_PROFILE.name}
                            </Text>
                            <Text style={{ color: Colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                                {USER_PROFILE.email}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                    </View>
                </Card>

                {/* Settings Sections */}
                {SETTINGS_SECTIONS.map(section => (
                    <View key={section.title} style={{ marginBottom: 24 }}>
                        <Text style={{ color: Colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginLeft: 4 }}>
                            {section.title.toUpperCase()}
                        </Text>
                        <Card style={{ padding: 0, overflow: 'hidden' }}>
                            {section.items.map((item, idx) => (
                                <TouchableOpacity
                                    key={item.label}
                                    activeOpacity={0.6}
                                    onPress={item.isDestructive ? handleLogout : undefined}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 16,
                                        borderBottomWidth: idx < section.items.length - 1 ? 1 : 0,
                                        borderBottomColor: Colors.divider,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            backgroundColor: item.isDestructive ? Colors.loss + '18' : Colors.surfaceElevated,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 12,
                                        }}
                                    >
                                        <Ionicons
                                            name={item.icon}
                                            size={18}
                                            color={item.isDestructive ? Colors.loss : Colors.textSecondary}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                color: item.isDestructive ? Colors.loss : Colors.textPrimary,
                                                fontSize: 15,
                                                fontWeight: '500',
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                        {item.subtitle && (
                                            <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>
                                                {item.subtitle}
                                            </Text>
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
            </ScrollView>
        </SafeAreaView>
    );
}
