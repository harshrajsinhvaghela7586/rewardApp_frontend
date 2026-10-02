import React, { useState } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Gift,
  Share2,
} from 'lucide-react-native';

import Screen from '../components/Screen';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

import { userApi } from '../services/api';
import { colors, spacing } from '../theme/theme';

export default function ReferralCodeScreen({
  navigation,
  route,
}) {
  const phone = route.params?.phone || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
const handleContinue = async () => {
  const referralCode = code.trim().toUpperCase();

  if (!referralCode) {
    Alert.alert(
      'Referral Code Required',
      'Please enter a referral code to continue.'
    );
    return;
  }

  setLoading(true);

  try {
    await userApi.referral(referralCode);

    navigation.replace('Vehicle', {
      form: {
        phone,
        referralCode,
      },
    });
  } catch (error) {
    Alert.alert(
      'Invalid Referral Code',
      error?.message ||
        'Please enter a valid referral code.'
    );
  } finally {
    setLoading(false);
  }
};


const handleSkip = async () => {
  try {
    await userApi.skipReferral();

    navigation.replace('Vehicle', {
      form: {
        phone,
      },
    });
  } catch (error) {
    Alert.alert(
      'Unable to Continue',
      error?.message ||
        'Please try again.'
    );
  }
};
  const continueWithoutCode = () => {
    navigation.replace('Vehicle', {
      form: {
        phone,
      },
    });
  };

  const applyCode = async () => {
    const referralCode =
      code.trim().toUpperCase();

    if (!referralCode) {
      Alert.alert(
        'Referral Code',
        'Please enter a referral code or skip this step.'
      );
      return;
    }

    setLoading(true);

    try {
      await userApi.referral(referralCode);

      Alert.alert(
        'Referral Applied',
        'Your referral code has been applied successfully.',
        [
          {
            text: 'Continue',
            onPress: () => {
              navigation.replace('Vehicle', {
                form: {
                  phone,
                  referralCode,
                },
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Invalid Referral Code',
        error?.message ||
          'Unable to apply referral code.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Header
        title="Have a referral code?"
        step="02"
        subtitle="If someone referred you to Vinsure, enter their referral code below."
      />

      <View style={styles.heroCard}>
        <View style={styles.iconBox}>
          <Gift
            size={25}
            color={colors.blue}
          />
        </View>

        <Text style={styles.title}>
          Welcome to Vinsure
        </Text>

        <Text style={styles.subtitle}>
          Enter your referral code if you have one.
          You can also continue without a code.
        </Text>
      </View>

      <View style={styles.card}>
        <Input
          label="Referral Code"
          value={code}
          onChangeText={(value) =>
            setCode(
              value
                .replace(/[^a-zA-Z0-9]/g, '')
                .slice(0, 10)
                .toUpperCase()
            )
          }
          placeholder="e.g. AB12CD"
          autoCapitalize="characters"
        />

      <Button
  title="Continue"
  loading={loading}
  onPress={handleContinue}
/>
      </View>

      <View style={styles.skipCard}>
        <Share2
          size={18}
          color={colors.muted}
        />

        <Text style={styles.skipText}>
    Don't have a referral code?
  </Text>
      </View>

      <Button
    title="Skip"
    variant="outline"
    onPress={handleSkip}
  />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 18,
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: '#E1EAF6',
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FF',
    marginBottom: 12,
  },

  title: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.navy,
  },

  subtitle: {
    marginTop: 7,
    fontSize: 11,
    lineHeight: 17,
    color: colors.muted,
    textAlign: 'center',
  },

  card: {
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  skipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },

  skipText: {
    marginLeft: 7,
    fontSize: 11,
    color: colors.muted,
  },
});