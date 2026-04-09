import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Pressable, View, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface FloatingIconProps {
  icon: string;
  size?: number;
  glowColor?: string;
  onPress?: () => void;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({
  icon,
  size = 40,
  glowColor = Colors.primary,
  onPress,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.85,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          { alignItems: 'center' },
          {
            transform: [
              { translateY: floatAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Outer glow effect */}
        <View
          style={{
            position: 'absolute',
            width: size + 30,
            height: size + 30,
            borderRadius: (size + 30) / 2,
            backgroundColor: glowColor,
            opacity: 0.1,
          }}
        />

        {/* Middle glow effect */}
        <View
          style={{
            position: 'absolute',
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            backgroundColor: glowColor,
            opacity: 0.2,
          }}
        />

        {/* Icon container with gradient */}
        <LinearGradient
          colors={[glowColor, Colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: size + 12,
            height: size + 12,
            borderRadius: (size + 12) / 2,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            shadowColor: glowColor,
            shadowOpacity: 0.4,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: size, lineHeight: size }}>{icon}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};
