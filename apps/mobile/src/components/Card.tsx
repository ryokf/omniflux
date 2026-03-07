import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Colors } from '@/src/constants/colors';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    elevated?: boolean;
}

export function Card({ children, style, elevated = false }: CardProps) {
    return (
        <View
            style={[
                {
                    backgroundColor: elevated ? Colors.surfaceElevated : Colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: Colors.surfaceBorder,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}
