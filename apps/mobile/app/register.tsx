import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Colors } from '@/src/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '@/src/api/client';


export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Harap isi semua kolom');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Kata sandi tidak cocok');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Kata sandi minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/users/register', { email, password });

      Alert.alert(
        'Berhasil',
        'Akun berhasil dibuat! Silakan masuk.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error: any) {
      console.error('Register Error:', error.response?.data || error.message);
      Alert.alert(
        'Pendaftaran Gagal',
        error.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      >
        {/* Logo / Brand */}
        <View className="items-center mb-12">
          <View
            className="w-[72px] h-[72px] rounded-2xl bg-primary justify-center items-center mb-4"
            style={{
              shadowColor: Colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
            }}
          >
            <Text className="text-[32px] text-white font-extrabold">O</Text>
          </View>
          <Text className="text-[28px] font-extrabold text-txt tracking-wide">
            Buat Akun
          </Text>
          <Text className="text-txt-secondary text-sm mt-1.5">
            Daftar untuk mulai menggunakan OmniFlux
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          <Text className="text-txt-secondary text-[13px] mb-2 font-medium">Email</Text>
          <TextInput
            className="bg-input-bg rounded-xl p-4 text-txt text-base border border-surface-border"
            placeholder="andi@omniflux.id"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mb-6">
          <Text className="text-txt-secondary text-[13px] mb-2 font-medium">Kata Sandi</Text>
          <TextInput
            className="bg-input-bg rounded-xl p-4 text-txt text-base border border-surface-border"
            placeholder="Minimal 6 karakter"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="mb-8">
          <Text className="text-txt-secondary text-[13px] mb-2 font-medium">Konfirmasi Kata Sandi</Text>
          <TextInput
            className="bg-input-bg rounded-xl p-4 text-txt text-base border border-surface-border"
            placeholder="Ulangi kata sandi"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={loading}
          className="bg-primary rounded-[14px] py-[17px] items-center"
          style={{
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text className="text-white text-[17px] font-bold">Daftar</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-txt-secondary text-sm">Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary text-sm font-semibold">Masuk</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
