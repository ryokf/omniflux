import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
    DeviceEventEmitter,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { apiClient } from '@/src/api/client';
import * as SecureStore from 'expo-secure-store';

interface AddWalletModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ICON_OPTIONS = ['🏦', '💳', '👛', '🏧', '💰', '💵', '🪙', '📈', '🏠', '🚗'];

export function AddWalletModal({ visible, onClose, onSuccess }: AddWalletModalProps) {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('🏦');
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setName('');
        setSelectedIcon('🏦');
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Harap isi nama dompet.');
            return;
        }

        const strUserId = await SecureStore.getItemAsync('userId');
        if (!strUserId) {
            Alert.alert('Error', 'Sesi tidak ditemukan. Silakan login ulang.');
            return;
        }

        setLoading(true);
        try {
            // API hanya menerima `name` dan `user_id` (sesuai CreateWalletDto)
            await apiClient.post('/wallets', {
                name: name.trim(),
                user_id: Number(strUserId),
            });

            DeviceEventEmitter.emit('refreshDashboard');
            Alert.alert('Sukses', `Dompet "${name.trim()}" berhasil dibuat!`);
            resetForm();
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Failed to create wallet:', error.response?.data || error.message);
            Alert.alert('Gagal', 'Terjadi kesalahan saat membuat dompet. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable className="flex-1 bg-black/55" onPress={onClose} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl"
            >
                {/* Handle */}
                <View className="items-center pt-3 pb-1">
                    <View className="w-10 h-1 rounded-sm bg-txt-muted" />
                </View>

                {/* Header */}
                <View className="flex-row justify-between items-center px-5 pt-2 pb-4">
                    <Text className="text-txt text-xl font-extrabold">Buat Dompet Baru</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="px-5"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Icon Picker */}
                    <Text className="text-txt-secondary text-xs font-semibold mb-2">Pilih Ikon</Text>
                    <View className="flex-row flex-wrap mb-4 gap-2">
                        {ICON_OPTIONS.map(icon => (
                            <TouchableOpacity
                                key={icon}
                                onPress={() => setSelectedIcon(icon)}
                                className={`w-12 h-12 rounded-xl items-center justify-center border-2 ${
                                    selectedIcon === icon
                                        ? 'border-primary bg-primary/15'
                                        : 'border-surface-border bg-input-bg'
                                }`}
                            >
                                <Text className="text-2xl">{icon}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Name */}
                    <View className="mb-4">
                        <Text className="text-txt-secondary text-xs font-semibold mb-1.5">
                            Nama Dompet
                        </Text>
                        <TextInput
                            className="bg-input-bg rounded-xl p-3.5 text-txt text-[15px] border border-surface-border"
                            placeholder="Cth: BCA, GoPay, Tunai..."
                            placeholderTextColor={Colors.textMuted}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>



                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        activeOpacity={0.85}
                        className="bg-primary rounded-[14px] py-4 items-center"
                        style={{
                            shadowColor: Colors.primary,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.35,
                            shadowRadius: 12,
                            elevation: 8,
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        <Text className="text-white text-base font-bold">
                            {loading ? 'Menyimpan...' : '🏦 Buat Dompet'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
