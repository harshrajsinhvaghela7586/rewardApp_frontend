import React, { useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  FileCheck2,
  ShieldCheck,
} from 'lucide-react-native';

import Screen from '../components/Screen';
import Header from '../components/Header';
import UploadBox from '../components/UploadBox';
import Button from '../components/Button';
import Progress from '../components/Progress';

import { pickImage } from '../utils/picker';
import { colors, spacing } from '../theme/theme';

export default function VehicleScreen({ navigation, route }) {
  const form = route.params?.form || {};

  const [rcFile, setRcFile] = useState(null);
  const [policyFile, setPolicyFile] = useState(null);

  // yes / no
  const [claimedPrevious, setClaimedPrevious] = useState(
    form.claimedPrevious ?? null
  );

  const [loading, setLoading] = useState(false);

  const handlePickRC = async () => {
    try {
      const file = await pickImage();

      if (file) {
        setRcFile(file);
      }
    } catch (error) {
      Alert.alert(
        'Upload Error',
        'Unable to select the RC document. Please try again.'
      );
    }
  };

  const handlePickPolicy = async () => {
    try {
      const file = await pickImage();

      if (file) {
        setPolicyFile(file);
      }
    } catch (error) {
      Alert.alert(
        'Upload Error',
        'Unable to select the insurance document. Please try again.'
      );
    }
  };

  const handleContinue = () => {
    if (!rcFile) {
      Alert.alert(
        'RC Required',
        'Please upload your Registration Certificate before continuing.'
      );
      return;
    }

   if (claimedPrevious === null) {
  Alert.alert(
    'Selection Required',
    'Please select Yes or No.'
  );
  return;
}

if (!policyFile) {
  Alert.alert(
    'Insurance Required',
    'Please upload your insurance document before continuing.'
  );
  return;
}

    setLoading(true);

    navigation.navigate('Personal', {
  form: {
    ...form,
    rc: rcFile,
    policy: policyFile,
    claimedPrevious,
  },
});
    setLoading(false);
  };

  return (
    <Screen>
      <Progress current={1} />

      <Header
        title="Vehicle & Insurance"
        step="02"
        subtitle="Upload your RC and provide your previous insurance claim details."
      />

      {/* ================= RC ================= */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconBox}>
            <FileCheck2
              size={19}
              color={colors.blue}
            />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.sectionTitle}>
              Registration Certificate
            </Text>

            <Text style={styles.sectionSubtitle}>
              Upload a clear photo of your RC
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <UploadBox
            title={
              rcFile
                ? 'RC Document Selected'
                : 'Tap to Upload RC'
            }
            file={rcFile}
            onPress={handlePickRC}
            onRemove={() => setRcFile(null)}
          />
        </View>
      </View>

      {/* ================= INSURANCE ================= */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconBox}>
            <ShieldCheck
              size={19}
              color={colors.blue}
            />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.sectionTitle}>
              Previous Insurance
            </Text>

            <Text style={styles.sectionSubtitle}>
              Tell us about your previous insurance claim
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.question}>
            Have you claimed your previous insurance?
          </Text>

          <View style={styles.optionRow}>
           <Pressable
  style={[
    styles.option,
    claimedPrevious === 'yes' && styles.optionActive,
  ]}
  onPress={() => setClaimedPrevious('yes')}
>
  <Text
    style={[
      styles.optionText,
      claimedPrevious === 'yes' &&
        styles.optionTextActive,
    ]}
  >
    Yes
  </Text>
</Pressable>

<Pressable
  style={[
    styles.option,
    claimedPrevious === 'no' && styles.optionActive,
  ]}
  onPress={() => setClaimedPrevious('no')}
>
  <Text
    style={[
      styles.optionText,
      claimedPrevious === 'no' &&
        styles.optionTextActive,
    ]}
  >
    No
  </Text>
</Pressable>
</View>

          
          <View style={styles.policyUpload}>
  <UploadBox
    title={
      policyFile
        ? 'Insurance Document Selected'
        : 'Tap to Upload Insurance'
    }
    file={policyFile}
    onPress={handlePickPolicy}
    onRemove={() => setPolicyFile(null)}
  />
</View>
          

         
    
        </View>
      </View>

      {/* ================= SECURITY ================= */}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          🔒 Your documents are secure
        </Text>

        <Text style={styles.infoText}>
          Your documents will be securely uploaded and
          used only for insurance verification.
        </Text>
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
    marginTop: spacing.md,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF5FF',
  },

  headerContent: {
    flex: 1,
    marginLeft: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.navy,
  },

  sectionSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  card: {
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  question: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 11,
  },

  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  option: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },

  optionActive: {
    backgroundColor: '#EEF5FF',
    borderColor: colors.blue,
  },

  optionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
  },

  optionTextActive: {
    color: colors.blue,
  },

  policyUpload: {
    marginTop: 14,
  },

  noPolicyCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F7FAFF',
  },

  noPolicyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },

  noPolicyText: {
    fontSize: 10.5,
    lineHeight: 15,
    color: colors.muted,
    marginTop: 3,
  },

  infoCard: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
  },

  infoText: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.muted,
  },
});