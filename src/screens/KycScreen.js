import React, { useState } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Screen from '../components/Screen';
import Header from '../components/Header';
import UploadBox from '../components/UploadBox';
import Button from '../components/Button';
import Progress from '../components/Progress';

import { pickImage } from '../utils/picker';
import { colors, spacing } from '../theme/theme';

export default function KycScreen({ navigation, route }) {
  const form = route.params?.form || {};

  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [pan, setPan] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleAadhaarFront = async () => {
    try {
      const file = await pickImage();

      if (file) {
        setAadhaarFront(file);
      }
    } catch (error) {
      Alert.alert(
        'Upload Error',
        'Unable to select Aadhaar front. Please try again.'
      );
    }
  };

  const handleAadhaarBack = async () => {
    try {
      const file = await pickImage();

      if (file) {
        setAadhaarBack(file);
      }
    } catch (error) {
      Alert.alert(
        'Upload Error',
        'Unable to select Aadhaar back. Please try again.'
      );
    }
  };

  const handlePan = async () => {
    try {
      const file = await pickImage();

      if (file) {
        setPan(file);
      }
    } catch (error) {
      Alert.alert(
        'Upload Error',
        'Unable to select PAN card. Please try again.'
      );
    }
  };

  const handleContinue = () => {
    if (!aadhaarFront) {
      Alert.alert(
        'Aadhaar Front Required',
        'Please upload the front side of your Aadhaar card.'
      );
      return;
    }

    if (!aadhaarBack) {
      Alert.alert(
        'Aadhaar Back Required',
        'Please upload the back side of your Aadhaar card.'
      );
      return;
    }

    if (!pan) {
      Alert.alert(
        'PAN Required',
        'Please upload your PAN card before continuing.'
      );
      return;
    }

    setLoading(true);

    navigation.navigate('Nominee', {
      form: {
        ...form,
        aadhaarFront,
        aadhaarBack,
        pan,
      },
    });

    setLoading(false);
  };

  return (
    <Screen>
      <Progress current={3} />

      <Header
        title="Upload KYC documents"
        step="04"
        subtitle="Upload clear and readable copies of your Aadhaar and PAN card."
      />

      {/* Aadhaar Front */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.title}>
              Aadhaar Card — Front
            </Text>

            <Text style={styles.subtitle}>
              Upload the front side of your Aadhaar
            </Text>
          </View>

          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>
              Required
            </Text>
          </View>
        </View>

        <UploadBox
          title={
            aadhaarFront
              ? 'Aadhaar Front Selected'
              : 'Tap to Upload Aadhaar Front'
          }
          file={aadhaarFront}
          onPress={handleAadhaarFront}
          onRemove={() => setAadhaarFront(null)}
        />
      </View>

      {/* Aadhaar Back */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.title}>
              Aadhaar Card — Back
            </Text>

            <Text style={styles.subtitle}>
              Upload the back side of your Aadhaar
            </Text>
          </View>

          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>
              Required
            </Text>
          </View>
        </View>

        <UploadBox
          title={
            aadhaarBack
              ? 'Aadhaar Back Selected'
              : 'Tap to Upload Aadhaar Back'
          }
          file={aadhaarBack}
          onPress={handleAadhaarBack}
          onRemove={() => setAadhaarBack(null)}
        />
      </View>

      {/* PAN */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.title}>
              PAN Card
            </Text>

            <Text style={styles.subtitle}>
              Required for identity verification
            </Text>
          </View>

          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>
              Required
            </Text>
          </View>
        </View>

        <UploadBox
          title={
            pan
              ? 'PAN Card Selected'
              : 'Tap to Upload PAN'
          }
          file={pan}
          onPress={handlePan}
          onRemove={() => setPan(null)}
        />
      </View>

      {/* Security */}

      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Text style={styles.lock}>🔒</Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            Your documents are secure
          </Text>

          <Text style={styles.infoText}>
            Please upload clear, readable documents.
            Your documents are securely stored and used
            only for verification.
          </Text>
        </View>
      </View>

      <Button
        title="Continue"
        loading={loading}
        onPress={handleContinue}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 11,
    color: colors.muted,
  },

  requiredBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#EEF5FF',
  },

  requiredText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.blue,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F6FF',
    marginRight: 10,
  },

  lock: {
    fontSize: 16,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  infoText: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.muted,
  },
});