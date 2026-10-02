import React, { useEffect, useState } from 'react';

import {
  Alert,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Bell,
  CarFront,
  Check,
  Gift,
  LogOut,
  Share2,
  UserRound,
  UsersRound,
} from 'lucide-react-native';

import Screen from '../components/Screen';

import {
  clearToken,
  userApi,
} from '../services/api';

import { colors } from '../theme/theme';

export default function ReferralScreen({
  navigation,
}) {
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [loadingCode, setLoadingCode] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoadingCode(true);

      const response = await userApi.me();

      const currentUser =
        response?.user || null;

      setUser(currentUser);

      setReferralCode(
        currentUser?.referralCode || ''
      );
    } catch (error) {
      setUser(null);
      setReferralCode('');
    } finally {
      setLoadingCode(false);
    }
  };

  const logout = async () => {
    await clearToken();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Splash' }],
    });
  };

  const shareReferral = async () => {
    if (!referralCode) {
      Alert.alert(
        'Referral Code',
        'Your referral code is not available right now. Please try again.'
      );
      return;
    }

    try {
      await Share.share({
        message:
          `Join Vinsure and get your motor insurance easily. ` +
          `Use my referral code ${referralCode}.`,
      });
    } catch (error) {
      if (error?.message) {
        Alert.alert(
          'Unable to share',
          error.message
        );
      }
    }
  };

  return (
    <Screen
      contentStyle={styles.content}
      footer={
        <View style={styles.bottomNav}>
          <NavItem
            icon={<CarFront size={21} />}
            label="Home"
            onPress={() =>
              navigation.navigate('Home')
            }
          />

          <NavItem
            icon={<Gift size={21} />}
            label="Rewards"
            onPress={() =>
              navigation.navigate('Scratch')
            }
          />

          <NavItem
            icon={<UsersRound size={21} />}
            label="Refer"
            active
          />

          <NavItem
            icon={<UserRound size={21} />}
            label="Profile"
            onPress={() =>
              navigation.navigate('Profile')
            }
          />
        </View>
      }
    >
      {/* ================================================= */}
      {/* TOP HEADER */}
      {/* ================================================= */}

      <View style={styles.top}>
        <View style={styles.greeting}>
          <Text style={styles.hello}>
            Welcome Back!
          </Text>

          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {user?.name ||
              user?.phone ||
              'Policyholder'}
          </Text>
        </View>

        <View style={styles.topActions}>
          

          <Pressable
            style={({ pressed }) => [
              styles.topAction,
              styles.logoutTop,
              pressed && styles.pressed,
            ]}
            onPress={logout}
          >
            <LogOut
              size={18}
              color={colors.danger}
            />
          </Pressable>
        </View>
      </View>

      {/* ================================================= */}
      {/* MAIN REWARD CARD */}
      {/* ================================================= */}

      <View style={styles.rewardCard}>
        <View style={styles.rewardIcon}>
          <Gift
            size={29}
            color={colors.orange}
          />
        </View>

        <Text style={styles.rewardLabel}>
          EARN REWARD
        </Text>

        <Text style={styles.rewardAmount}>
          ₹100
        </Text>

        <Text style={styles.rewardText}>
          For every eligible friend whose first
          motor insurance policy gets completed.
        </Text>
      </View>

      {/* ================================================= */}
      {/* HOW IT WORKS */}
      {/* ================================================= */}

      <View style={styles.howCard}>
        <Text style={styles.sectionTitle}>
          How it works
        </Text>

        <ReferralStep
          number="01"
          title="Share your code"
          text="Send your referral code to a friend."
        />

        <ReferralStep
          number="02"
          title="Friend joins Vinsure"
          text="Your friend uses your code while getting their motor insurance."
        />

        <ReferralStep
          number="03"
          title="Earn ₹100"
          text="Once the eligible policy is completed, your reward can be credited."
          last
        />
      </View>

      {/* ================================================= */}
      {/* REFERRAL CODE */}
      {/* ================================================= */}

      <View style={styles.codeCard}>
        <View style={styles.codeHeader}>
          <View>
            <Text style={styles.codeLabel}>
              YOUR REFERRAL CODE
            </Text>

            <Text style={styles.codeSub}>
              Share this code with your friends
            </Text>
          </View>

          <Share2
            size={19}
            color={colors.blue}
          />
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeText}>
            {loadingCode
              ? 'Loading...'
              : referralCode || 'Not Available'}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.sharePressed,
            !referralCode &&
              !loadingCode &&
              styles.shareButtonDisabled,
          ]}
          onPress={shareReferral}
          disabled={
            loadingCode || !referralCode
          }
        >
          <Share2
            size={18}
            color={colors.white}
          />

          <Text style={styles.shareButtonText}>
            Share Referral
          </Text>
        </Pressable>
      </View>

    </Screen>
  );
}

/* ================================================= */
/* REFERRAL STEP */
/* ================================================= */

function ReferralStep({
  number,
  title,
  text,
  last,
}) {
  return (
    <View
      style={[
        styles.step,
        last && styles.stepLast,
      ]}
    >
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>
          {number}
        </Text>
      </View>

      <View style={styles.stepCopy}>
        <Text style={styles.stepTitle}>
          {title}
        </Text>

        <Text style={styles.stepText}>
          {text}
        </Text>
      </View>
    </View>
  );
}

/* ================================================= */
/* BOTTOM NAV */
/* ================================================= */

function NavItem({
  icon,
  label,
  active,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navItem,
        pressed && styles.navPressed,
      ]}
    >
      {React.cloneElement(icon, {
        color: active
          ? colors.blue
          : '#8A96A8',
      })}

      <Text
        style={[
          styles.navText,
          active && styles.navTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({
  /* ================= CONTENT ================= */

  content: {
    paddingTop: 18,
  },

  /* ================= TOP ================= */

  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  greeting: {
    flex: 1,
    paddingRight: 12,
  },

  hello: {
    fontSize: 13,
    color: colors.muted,
  },

  name: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.navy,
    marginTop: 3,
  },

  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  topAction: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutTop: {
    borderColor: '#F0CACA',
    backgroundColor: '#FFF8F8',
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  /* ================= REWARD ================= */

  rewardCard: {
    backgroundColor: colors.blue,
    borderRadius: 21,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },

  rewardIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor:
      'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  rewardLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#CFE0FF',
    letterSpacing: 1.1,
  },

  rewardAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.white,
    marginTop: 1,
  },

  rewardText: {
    maxWidth: 280,
    fontSize: 10.5,
    lineHeight: 16,
    color: '#E5EEFF',
    textAlign: 'center',
    marginTop: 4,
  },

  /* ================= HOW IT WORKS ================= */

  howCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.navy,
    marginBottom: 13,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 13,
    marginBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F5',
  },

  stepLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },

  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumberText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.blue,
  },

  stepCopy: {
    flex: 1,
    marginLeft: 10,
  },

  stepTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.navy,
  },

  stepText: {
    fontSize: 9.5,
    lineHeight: 15,
    color: colors.muted,
    marginTop: 2,
  },

  /* ================= CODE ================= */

  codeCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 13,
  },

  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  codeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.navy,
    letterSpacing: 1,
  },

  codeSub: {
    fontSize: 9.5,
    color: colors.muted,
    marginTop: 3,
  },

  codeBox: {
    borderWidth: 1.5,
    borderColor: '#C7D8F3',
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: '#F7FAFF',
    marginBottom: 11,
  },

  codeText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.blue,
    textAlign: 'center',
    letterSpacing: 2,
  },

  shareButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  shareButtonDisabled: {
    opacity: 0.55,
  },

  sharePressed: {
    opacity: 0.8,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  shareButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.white,
  },

  /* ================= INFO ================= */

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FAF5',
    borderRadius: 13,
    padding: 11,
    marginBottom: 8,
  },

  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#DDF5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 14,
    color: '#527466',
    marginLeft: 8,
  },

  /* ================= BOTTOM NAV ================= */

  bottomNav: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  navPressed: {
    opacity: 0.65,
  },

  navText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A96A8',
  },

  navTextActive: {
    color: colors.blue,
  },
});