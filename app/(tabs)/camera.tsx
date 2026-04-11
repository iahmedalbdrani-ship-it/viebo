import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { CameraView, CameraViewRef, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useRef, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const FILTERS = [
  { id: 'normal', name: 'Normal', color: null, opacity: 0 },
  { id: 'bw', name: 'B&W', color: '#000000', opacity: 0.5 },
  { id: 'vintage', name: 'Vintage', color: '#FFA500', opacity: 0.3 },
  { id: 'cool', name: 'Cool', color: '#0088FF', opacity: 0.25 },
  { id: 'warm', name: 'Warm', color: '#FF6B6B', opacity: 0.25 },
];

export default function CameraScreen() {
  const cameraRef = useRef<CameraViewRef>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [isRecording, setIsRecording] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const recordingDot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingDot, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(recordingDot, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isRecording]);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        setCapturedImage(photo.uri);
      }
    }
  };

  const handlePickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) {
        setGalleryImage(result.assets[0].uri);
      }
    }
  };

  const getFilter = (filterId: string) => FILTERS.find(f => f.id === filterId);
  const filter = getFilter(selectedFilter);

  if (!permission) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.permissionText}>Camera access is required.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.capturePreview} />
        <View style={styles.captureActions}>
          <TouchableOpacity
            style={[styles.captureButton, styles.cancelButton]}
            onPress={() => setCapturedImage(null)}
          >
            <Text style={styles.captureButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.captureButton, styles.uploadButton]}
            onPress={() => {
              // Upload logic here
              setCapturedImage(null);
            }}
          >
            <Text style={[styles.captureButtonText, styles.uploadButtonText]}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const dotOpacity = recordingDot.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
        >
          {/* Gallery Image Overlay */}
          {galleryImage && (
            <Image source={{ uri: galleryImage }} style={styles.galleryOverlay} />
          )}

          {/* Filter Overlay */}
          {filter && filter.color && (
            <View
              style={[
                styles.filterOverlay,
                {
                  backgroundColor: filter.color,
                  opacity: filter.opacity,
                },
              ]}
            />
          )}
        </CameraView>

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.controlIcon}
            onPress={() => setFlash(flash === 'off' ? 'on' : flash === 'on' ? 'auto' : 'off')}
          >
            <MaterialIcons
              name={flash === 'off' ? 'flash-off' : flash === 'on' ? 'flash-on' : 'flash-auto'}
              size={24}
              color={Colors.text}
            />
            <Text style={styles.controlLabel}>{flash}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlIcon}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <MaterialIcons name="flip-camera-android" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Left Filter Selector */}
        <View style={styles.filterSelector}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.filterButton,
                  selectedFilter === f.id && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(f.id)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === f.id && styles.filterButtonTextActive,
                  ]}
                >
                  {f.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setGalleryImage(null)}
        >
          <MaterialIcons name="photo-library" size={28} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shutterButton, isRecording && styles.recordingActive]}
          onPress={handleTakePicture}
          onLongPress={() => setIsRecording(!isRecording)}
          delayLongPress={500}
        >
          {isRecording && (
            <Animated.View
              style={[
                styles.recordingDot,
                { opacity: dotOpacity },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handlePickFromGallery}
        >
          <MaterialIcons name="image" size={28} color={Colors.text} />
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
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  galleryOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topControls: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  controlIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 10,
  },
  controlLabel: {
    color: Colors.text,
    fontSize: 10,
    marginTop: 4,
  },
  filterSelector: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -80 }],
    width: 60,
    height: 160,
    zIndex: 10,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  filterButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(108, 59, 255, 0.3)',
  },
  filterButtonText: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: Colors.primary,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomButton: {
    padding: 12,
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.danger,
    borderWidth: 3,
    borderColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingActive: {
    backgroundColor: 'rgba(255, 51, 102, 0.4)',
  },
  recordingDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.danger,
  },
  capturePreview: {
    flex: 1,
    resizeMode: 'cover',
  },
  captureActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: Colors.bg,
  },
  captureButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderColor: Colors.border,
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  captureButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButtonText: {
    color: Colors.text,
  },
  permissionText: {
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  permissionButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
