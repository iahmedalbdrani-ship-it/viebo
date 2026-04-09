import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface GlassContainerProps extends ViewProps {
  children: React.ReactNode;
  blurIntensity?: number;
  gradient?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  blurIntensity = 80,
  gradient = false,
  style,
}) => {
  const content = (
    <BlurView intensity={blurIntensity} style={[styles.container, style]}>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          padding: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </BlurView>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={['rgba(108, 59, 255, 0.1)', 'rgba(157, 78, 221, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientWrapper}
      >
        {content}
      </LinearGradient>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientWrapper: {
    borderRadius: 20,
  },
});
