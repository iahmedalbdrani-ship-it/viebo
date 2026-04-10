import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface IconItem {
  name: string;
  onPress: () => void;
}

interface FloatingIconsProps {
  icons: IconItem[];
}

export default function FloatingIcons({ icons }: FloatingIconsProps) {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const renderIcons = () => {
    return icons.map((icon, index) => {
      const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -(index + 1) * 60],
      });
      const opacity = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
      });
      return (
        <Animated.View
          key={icon.name}
          style={[styles.iconWrapper, { transform: [{ translateY }], opacity }]}
        >
          <TouchableOpacity onPress={icon.onPress} style={styles.iconButton}>
            <MaterialIcons name={icon.name as any} size={24} color={Colors.text} />
          </TouchableOpacity>
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {renderIcons()}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <TouchableOpacity onPress={toggle} style={styles.fabButton}>
          <LinearGradient
            colors={[Colors.fab, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <MaterialIcons name="add" size={28} color={Colors.text} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
