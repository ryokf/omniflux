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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 28 }}
      >
        {/* Logo / Brand */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
              shadowColor: Colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
            }}
          >
            <Text style={{ fontSize: 32, color: Colors.white, fontWeight: '800' }}>O</Text>
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: Colors.textPrimary,
              letterSpacing: 1,
            }}
          >
            OmniFlux
          </Text>
          <Text style={{ color: Colors.textSecondary, fontSize: 14, marginTop: 6 }}>
            Assets Aggregator
          </Text>
        </View>

        {/* Form */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 8, fontWeight: '500' }}>
            Email
          </Text>
          <TextInput
            style={{
              backgroundColor: Colors.inputBg,
              borderRadius: 12,
              padding: 16,
              color: Colors.textPrimary,
              fontSize: 16,
              borderWidth: 1,
              borderColor: Colors.surfaceBorder,
            }}
            placeholder="andi@omniflux.id"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 8, fontWeight: '500' }}>
            Kata Sandi
          </Text>
          <TextInput
            style={{
              backgroundColor: Colors.inputBg,
              borderRadius: 12,
              padding: 16,
              color: Colors.textPrimary,
              fontSize: 16,
              borderWidth: 1,
              borderColor: Colors.surfaceBorder,
            }}
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
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 14,
            paddingVertical: 17,
            alignItems: 'center',
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
            <Text style={{ color: Colors.white, fontSize: 17, fontWeight: '700' }}>
              Masuk
            </Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>Belum punya akun? </Text>
          <TouchableOpacity>
            <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '600' }}>
              Daftar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
