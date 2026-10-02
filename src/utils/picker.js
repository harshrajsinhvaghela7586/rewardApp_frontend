import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export async function pickImage() {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      'Permission required',
      'Allow photo library access to upload your document.'
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.82,
    // Crop/edit screen band: photo select karte hi seedha upload ho jayegi
    allowsEditing: false,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  return {
    uri: asset.uri,
    name: asset.fileName || `document_${Date.now()}.jpg`,
    type: asset.mimeType || 'image/jpeg',
  };
}

export function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validName(v) {
  return /^[A-Za-z .'-]{2,60}$/.test(v);
}