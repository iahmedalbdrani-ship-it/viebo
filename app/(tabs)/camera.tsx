import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import React, { useState } from 'react';

export default function CameraScreen() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.previewArea}>
        <LinearGradient
          colors={[Colors.bg3, Colors.bg2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.preview}
        >
          <Text style={styles.cameraIcon}>📹</Text>
          <Text style={styles.previewText}>Camera Preview</Text>
        </LinearGradient>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.filterButton]}
          onPress={() => {}}
        >
          <Text style={styles.controlButtonText}>Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordingActive,
          ]}
          onPress={() => setIsRecording(!isRecording)}
        >
          <View
            style={[
              styles.recordDot,
              isRecording && styles.recordDotActive,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.effectsButton]}
          onPress={() => {}}
        >
          <Text style={styles.controlButtonText}>Effects</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.uploadButton]}>
          <Text style={[styles.actionButtonText, styles.uploadButtonText]}>
            Upload
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
    justifyContent: 'space-between',
  },
  previewArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  preview: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  cameraIcon: {
    fontSize: 60,
  },
  previewText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  controlButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterButton: {
    borderColor: Colors.accent,
  },
  effectsButton: {
    borderColor: Colors.secondary,
  },
  controlButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingActive: {
    backgroundColor: 'rgba(255, 51, 102, 0.2)',
  },
  recordDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.danger,
  },
  recordDotActive: {
    backgroundColor: Colors.danger,
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButtonText: {
    color: Colors.text,
  },
});
