import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

interface VibeMatch {
  id: string;
  name: string;
  vibe: string;
  compatibility: number;
}

const MOCK_MATCHES: VibeMatch[] = [
  { id: '1', name: 'Alex', vibe: 'Creative', compatibility: 92 },
  { id: '2', name: 'Jordan', vibe: 'Adventurous', compatibility: 87 },
  { id: '3', name: 'Casey', vibe: 'Chill', compatibility: 85 },
];

export default function VibeMatchScreen() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentMatch = MOCK_MATCHES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_MATCHES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_MATCHES.length) % MOCK_MATCHES.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vibe Match</Text>
      </View>

      <View style={styles.cardContainer}>
        {currentMatch && (
          <LinearGradient
            colors={[Colors.secondary, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Text style={styles.name}>{currentMatch.name}</Text>
              <Text style={styles.vibe}>{currentMatch.vibe}</Text>
              <View style={styles.compatibilityBar}>
                <View
                  style={[
                    styles.compatibilityFill,
                    { width: `${currentMatch.compatibility}%` },
                  ]}
                />
              </View>
              <Text style={styles.compatibility}>
                {currentMatch.compatibility}% Match
              </Text>
            </View>
          </LinearGradient>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handlePrev}>
          <Text style={styles.buttonText}>← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleNext}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    minHeight: 300,
    justifyContent: 'space-between',
  },
  cardContent: {
    gap: 16,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  vibe: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  compatibilityBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  compatibilityFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  compatibility: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: Colors.text,
  },
});

import React from 'react';
