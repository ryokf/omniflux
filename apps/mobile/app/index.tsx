import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/src/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-7"
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
            OmniFlux
          </Text>
          <Text className="text-txt-secondary text-sm mt-1.5">
            Assets Aggregator
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

        <View className="mb-8">
          <Text className="text-txt-secondary text-[13px] mb-2 font-medium">Kata Sandi</Text>
          <TextInput
            className="bg-input-bg rounded-xl p-4 text-txt text-base border border-surface-border"
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
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
            <Text className="text-white text-[17px] font-bold">Masuk</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-txt-secondary text-sm">Belum punya akun? </Text>
          <TouchableOpacity>
            <Text className="text-primary text-sm font-semibold">Daftar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
