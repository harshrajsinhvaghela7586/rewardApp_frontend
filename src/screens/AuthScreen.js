import React, { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  CheckCircle2,
  LockKeyhole,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react-native';

import Screen from '../components/Screen';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

import {
  authApi,
  saveToken,
} from '../services/api';

import {
  colors,
  radius,
} from '../theme/theme';

export default function AuthScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [sent, setSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  /* ================= PHONE ================= */

  const handlePhoneChange = (value) => {
    // Only numbers
    const digits = value
      .replace(/\D/g, '')
      .slice(0, 10);

    setPhone(digits);
  };

  /* ================= SEND OTP ================= */

  const send = async () => {
    if (phone.length !== 10) {
      Alert.alert(
        'Invalid number',
        'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.sendOtp(
        phone
      );

      setSent(true);

      /*
       * Development:
       * Backend may return OTP.
       *
       * Production:
       * OTP will NOT be returned.
       */
      if (response?.otp) {
        Alert.alert(
          'OTP Sent',
          `Development OTP: ${response.otp}`
        );
      } else {
        Alert.alert(
          'OTP Sent',
          'A 6-digit OTP has been sent to your mobile number.'
        );
      }
    } catch (error) {
      Alert.alert(
        'OTP Error',
        error?.message ||
        'Unable to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */

  const resend = async () => {
    if (phone.length !== 10) {
      return;
    }

    setResending(true);

    try {
      const response =
        await authApi.resendOtp(phone);

      if (response?.otp) {
        Alert.alert(
          'OTP Resent',
          `Development OTP: ${response.otp}`
        );
      } else {
        Alert.alert(
          'OTP Resent',
          'A new OTP has been sent to your mobile number.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Resend Failed',
        error?.message ||
        'Unable to resend OTP. Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  /* ================= VERIFY OTP ================= */

  const verify = async () => {
    if (otp.length !== 6) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the 6-digit OTP.'
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await authApi.verifyOtp(
          phone,
          otp
        );

      await saveToken(response.token);

      const nextStep =
        response?.application?.nextStep ||
        'Vehicle';

      const isFirstTime =
        response?.application?.isFirstTime === true;

      if (
        isFirstTime &&
        nextStep === 'Vehicle'
      ) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'ReferralCode',
              params: {
                phone,
              },
            },
          ],
        });

        return;
      }

      if (nextStep === 'Home') {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
            },
          ],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: nextStep,
              params: {
                form: {
                  phone,
                },
              },
            },
          ],
        });
      }
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        error?.message ||
        'Unable to verify OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        {/* ================= HEADER ================= */}

        <Header
          title={
            sent
              ? 'Verify your number'
              : 'Enter your mobile number'
          }
          step="01"
          subtitle={
            sent
              ? 'We sent a 6-digit OTP to your mobile number.'
              : 'We will send an OTP to securely verify your mobile number.'
          }
        />

        {/* ================= PHONE CARD ================= */}

        <View style={styles.phoneCard}>

          <View style={styles.sectionIcon}>
            {sent ? (
              <CheckCircle2
                size={21}
                color={colors.success}
              />
            ) : (
              <Phone
                size={21}
                color={colors.blue}
              />
            )}
          </View>

          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>
              Mobile Number
            </Text>

            <Text style={styles.sectionSubtitle}>
              {sent
                ? 'Number verified for OTP'
                : 'Enter your 10-digit mobile number'}
            </Text>
          </View>

          {sent && (
            <LockKeyhole
              size={18}
              color={colors.muted}
            />
          )}
        </View>

        {/* ================= PHONE INPUT ================= */}

        <Input
          label="Mobile Number"
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType="number-pad"
          maxLength={10}
          editable={!sent}
          placeholder="10-digit mobile number"
        />

        {/* ================= OTP ================= */}

        {!sent ? (
          <>
            <View style={styles.securityBox}>
              <ShieldCheck
                size={19}
                color={colors.blue}
              />

              <Text style={styles.securityText}>
                Your number is securely verified
                using OTP authentication.
              </Text>
            </View>

            <Button
              title="Send OTP"
              loading={loading}
              onPress={send}
            />
          </>
        ) : (
          <>
            {/* ================= LOCKED NUMBER ================= */}

            <View style={styles.verifiedCard}>

              <View style={styles.verifiedIcon}>
                <CheckCircle2
                  size={20}
                  color={colors.success}
                />
              </View>

              <View style={styles.verifiedContent}>
                <Text style={styles.verifiedPhone}>
                  +91 {phone}
                </Text>

                <Text style={styles.lockText}>
                  Number locked for verification
                </Text>
              </View>

              <LockKeyhole
                size={18}
                color={colors.muted}
              />
            </View>

            {/* ================= OTP HEADER ================= */}

            <View style={styles.otpHeader}>
              <View>
                <Text style={styles.otpTitle}>
                  Enter OTP
                </Text>

                <Text style={styles.otpSubtitle}>
                  Enter the 6-digit code sent to your number
                </Text>
              </View>

              <MessageCircle
                size={21}
                color={colors.blue}
              />
            </View>

            {/* ================= OTP INPUT ================= */}

            <Input
              label="6-Digit OTP"
              value={otp}
              onChangeText={(value) => {
                setOtp(
                  value
                    .replace(/\D/g, '')
                    .slice(0, 6)
                );
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="••••••"
            />

            {/* ================= VERIFY ================= */}

            <Button
              title="Verify & Continue"
              loading={loading}
              onPress={verify}
            />

            {/* ================= RESEND ================= */}

            <View style={styles.resendRow}>
              <Text style={styles.resendLabel}>
                Didn't receive the OTP?
              </Text>

              <Pressable
                onPress={resend}
                disabled={resending}
              >
                <Text
                  style={[
                    styles.resendButton,
                    resending &&
                    styles.resendDisabled,
                  ]}
                >
                  {resending
                    ? 'Sending...'
                    : 'Resend OTP'}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.expireText}>
              OTP is valid for a limited time.
            </Text>
          </>
        )}

      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({

  /* ================= PHONE CARD ================= */

  phoneCard: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 14,

    marginBottom: 14,

    borderRadius: radius?.lg || 16,

    backgroundColor: '#F7FAFF',

    borderWidth: 1,
    borderColor: '#E1EAF6',
  },

  sectionIcon: {
    width: 40,
    height: 40,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EAF2FF',
  },
  sectionContent: {
    flex: 1,
    marginLeft: 11,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.navy,
  },

  sectionSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  /* ================= SECURITY ================= */

  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 13,
    paddingVertical: 12,

    marginTop: 2,
    marginBottom: 18,

    borderRadius: 12,

    backgroundColor: '#EEF5FF',
  },

  securityText: {
    flex: 1,

    marginLeft: 9,

    fontSize: 10.5,
    lineHeight: 15,

    color: '#5E7087',
    fontWeight: '600',
  },

  /* ================= VERIFIED ================= */

  verifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 13,

    marginBottom: 22,

    borderRadius: 14,

    backgroundColor: '#F1FBF5',

    borderWidth: 1,
    borderColor: '#D5F0DE',
  },

  verifiedIcon: {
    width: 38,
    height: 38,

    borderRadius: 11,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#E1F6E8',
  },

  verifiedContent: {
    flex: 1,
    marginLeft: 10,
  },

  verifiedPhone: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.navy,
  },

  lockText: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  /* ================= OTP ================= */

  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 4,
  },

  otpTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.navy,
  },

  otpSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
    maxWidth: 275,
  },

  /* ================= RESEND ================= */

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 19,
  },

  resendLabel: {
    fontSize: 11,
    color: colors.muted,
  },

  resendButton: {
    marginLeft: 5,

    fontSize: 11,

    fontWeight: '900',

    color: colors.blue,
  },

  resendDisabled: {
    opacity: 0.45,
  },

  expireText: {
    textAlign: 'center',

    marginTop: 10,

    fontSize: 9,

    color: '#9AA8BA',
  },
});