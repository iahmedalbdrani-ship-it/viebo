import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAudio } from '../src/contexts/AudioContext';

const NUM_BARS = 30;

interface Props {
  id: string;
  uri: string;
  duration: number; // seconds
  isMine?: boolean;
}

// Seeded pseudo-random for consistent waveform per voice note
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateWaveform(id: string): number[] {
  const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = seededRandom(seed);
  return Array.from({ length: NUM_BARS }, () => {
    const base = rand();
    // Create natural-looking waveform with peaks
    return Math.max(0.1, Math.min(1, base * 0.7 + 0.15));
  });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VoiceNotePlayer({ id, uri, duration, isMine = false }: Props) {
  const { currentId, isPlaying, progress, currentPosition, totalDuration, playVoiceNote, pauseAudio, resumeAudio } =
    useAudio();

  const isThisNote = currentId === id;
  const waveform = useMemo(() => generateWaveform(id), [id]);

  const handleToggle = async () => {
    if (!isThisNote) {
      await playVoiceNote(id, uri);
    } else if (isPlaying) {
      await pauseAudio();
    } else {
      await resumeAudio();
    }
  };

  const displayDuration = isThisNote ? totalDuration : duration;
  const displayPosition = isThisNote ? currentPosition : 0;
  const displayProgress = isThisNote ? progress : 0;
  const highlightedBars = Math.floor(displayProgress * NUM_BARS);

  const containerColors = isMine
    ? (['rgba(108, 59, 255, 0.35)', 'rgba(157, 78, 221, 0.2)'] as const)
    : (['rgba(30, 30, 50, 0.8)', 'rgba(20, 20, 40, 0.9)'] as const);

  return (
    <BlurView intensity={70} style={[styles.container, isMine && styles.containerMine]}>
      <View style={[styles.inner, isMine ? styles.innerMine : styles.innerOther]}>
        {/* Play/Pause button */}
        <TouchableOpacity onPress={handleToggle} style={styles.playButton} activeOpacity={0.85}>
          <View style={[styles.playButtonInner, isThisNote && isPlaying && styles.playButtonActive]}>
            <MaterialIcons
              name={isThisNote && isPlaying ? 'pause' : 'play-arrow'}
              size={22}
              color={isThisNote && isPlaying ? Colors.primary : '#fff'}
            />
          </View>
        </TouchableOpacity>

        {/* Right section: waveform + duration */}
        <View style={styles.right}>
          {/* Waveform bars */}
          <View style={styles.waveform}>
            {waveform.map((barHeight, idx) => {
              const isHighlighted = idx < highlightedBars;
              const progress = idx / NUM_BARS;

              // Gradient from silver (#C0C0C0) to violet (#6C3BFF)
              const r = Math.round(192 + (108 - 192) * progress);
              const g = Math.round(192 + (59 - 192) * progress);
              const b = Math.round(192 + (255 - 192) * progress);
              const highlightColor = `rgb(${r},${g},${b})`;

              return (
                <View
                  key={idx}
                  style={[
                    styles.bar,
                    {
                      height: Math.max(3, barHeight * 32),
                      backgroundColor: isHighlighted ? highlightColor : 'rgba(192, 192, 192, 0.2)',
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Progress bar + duration */}
          <View style={styles.footer}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: `${displayProgress * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.durationText}>
              {isThisNote ? formatDuration(displayPosition) : formatDuration(displayDuration)}
            </Text>
          </View>
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    overflow: 'hidden',
    maxWidth: 280,
    minWidth: 200,
  },
  containerMine: {
    borderRadius: 18,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 1,
    borderRadius: 18,
  },
  innerMine: {
    borderColor: 'rgba(108, 59, 255, 0.4)',
    backgroundColor: 'rgba(108, 59, 255, 0.2)',
  },
  innerOther: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  playButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  playButtonActive: {
    backgroundColor: 'rgba(108, 59, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  right: {
    flex: 1,
    gap: 6,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    gap: 1.5,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
    maxWidth: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  durationText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    minWidth: 32,
    textAlign: 'right',
  },
});
