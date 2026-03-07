import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    elevated?: boolean;
    className?: string;
}

export function Card({ children, style, elevated = false, className = '' }: CardProps) {
    return (
        <View
            className={`rounded-2xl p-4 border ${elevated
                    ? 'bg-surface-el border-surface-border'
                    : 'bg-surface border-surface-border'
                } ${className}`}
            style={style}
        >
            {children}
        </View>
    );
}
