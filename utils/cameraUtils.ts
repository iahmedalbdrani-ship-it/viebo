import * as FileSystem from 'expo-file-system';
import { supabase } from '../src/config/supabase';

/**
 * Upload image to Supabase Storage
 * @param imageUri - Local image URI
 * @param fileName - Filename for storage
 * @returns URL of uploaded image
 */
export const uploadImageToStorage = async (
  imageUri: string,
  fileName: string
): Promise<string | null> => {
  try {
    const imageBlob = await fetch(imageUri).then((res) => res.blob());

    const { data, error } = await supabase.storage
      .from('posts')
      .upload(fileName, imageBlob, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${data.path}`;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

/**
 * Save image locally and get path
 * @param imageUri - Image URI
 * @returns Local file path
 */
export const saveImageLocally = async (imageUri: string): Promise<string | null> => {
  try {
    const fileName = `${Date.now()}.jpg`;
    const localPath = `${FileSystem.documentDirectory}photos/${fileName}`;

    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}photos`,
      { intermediates: true }
    );

    await FileSystem.copyAsync({
      from: imageUri,
      to: localPath,
    });

    return localPath;
  } catch (error) {
    console.error('Save locally failed:', error);
    return null;
  }
};

/**
 * Format image metadata for post
 */
export const createPostMetadata = (
  imageUri: string,
  filterId: string,
  caption?: string
) => {
  return {
    imageUri,
    filterId,
    caption,
    timestamp: new Date().toISOString(),
    type: 'image',
  };
};
