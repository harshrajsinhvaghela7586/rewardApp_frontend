import React, { useEffect, useState } from 'react';

import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Bell,
  CarFront,
  ChevronRight,
  Download,
  FileText,
  Gift,
  LogOut,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react-native';

import Screen from '../components/Screen';

import {
  policyApi,
  clearToken,
  userApi,
} from '../services/api';

import { colors } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    loadHome();
  }, []);

  const loadHome = async () => {
    const [u, p, r] = await Promise.allSettled([
      userApi.me(),
      policyApi.myPolicy(),
      policyApi.myScratchCard(),
    ]);

    if (u.status === 'fulfilled') {
      setUser(u.value.user);
    }

    if (p.status === 'fulfilled') {
      setPolicy(p.value.policy);
    }

    if (r.status === 'fulfilled') {
      setReward(r.value.card);
    }
  };

 const openPolicy = () => {
  if (!policy) {
    Alert.alert(
      'Policy',
      'Your policy is not uploaded yet.'
    );
    return;
  }

  if (!policy.policyFileUrl) {
    Alert.alert(
      'Policy Document',
      'Your policy document is not available yet.'
    );
    return;
  }

  Alert.alert(
    'Your Policy',
    policy.policyNumber
      ? `Policy Number: ${policy.policyNumber}`
      : 'Active Policy',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'View Policy',
        onPress: async () => {
          try {
            await Linking.openURL(
              policy.policyFileUrl
            );
          } catch {
            Alert.alert(
              'Unable to open',
              'The policy document could not be opened.'
            );
          }
        },
      },
    ]
  );
};

  const logout = async () => {
    await clearToken();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Splash' }],
    });
  };

  const firstName =
    user?.name?.trim() ||
    user?.phone ||
    'Policyholder';

  return (
    <Screen
      contentStyle={styles.content}
      footer={
        <View style={styles.bottomNav}>

          <Nav
            icon={<CarFront size={21} />}
            label="Home"
            active
          />

          <Nav
            icon={<Gift size={21} />}
            label="Rewards"
            onPress={() =>
              navigation.navigate('Scratch')
            }
          />

          <Nav
            icon={<UsersRound size={21} />}
            label="Refer"
            onPress={() =>
              navigation.navigate('Referral')
            }
          />

         <Nav
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
      {/* HEADER */}
      {/* ================================================= */}

      <View style={styles.top}>

        <View style={styles.greeting}>

          <Text style={styles.hello}>
            Welcome back 👋
          </Text>

          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {firstName}
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
      {/* HERO */}
      {/* ================================================= */}

      <View style={styles.hero}>

        <View style={styles.heroContent}>

          <View style={styles.heroKickerRow}>

            <View style={styles.heroStatusDot} />

            <Text style={styles.heroKicker}>
              MOTOR INSURANCE
            </Text>

          </View>

          <Text style={styles.heroTitle}>
            {policy
              ? 'Policy Active'
              : 'Request Submitted'}
          </Text>

          <Text
            style={styles.heroSub}
            numberOfLines={1}
          >
            {policy?.policyNumber ||
              'Your policy is being processed'}
          </Text>

          <View style={styles.heroStatus}>

            <ShieldCheck
              size={14}
              color="#DDF5E8"
            />

            <Text style={styles.heroStatusText}>
              {policy
                ? 'Your policy is active'
                : 'Application under review'}
            </Text>

          </View>

        </View>

        <View style={styles.heroCarCircle}>

          <CarFront
            size={43}
            color={colors.white}
            strokeWidth={1.8}
          />

        </View>

      </View>


      {/* ================================================= */}
      {/* QUICK OVERVIEW */}
      {/* ================================================= */}

      <View style={styles.sectionHeading}>

        <View>
          <Text style={styles.sectionTitle}>
            Your Dashboard
          </Text>

          <Text style={styles.sectionSub}>
            Manage your insurance and rewards
          </Text>
        </View>

      </View>


      {/* ================================================= */}
      {/* DASHBOARD CARDS */}
      {/* ================================================= */}

      <View style={styles.cards}>

        <DashCard
          icon={
            <CarFront
              size={22}
              color={colors.blue}
            />
          }
          iconBackground="#EEF4FF"
          title="Motor Insurance"
          text={
            policy
              ? 'View and manage your active policy'
              : 'Track your insurance request'
          }
          status={
            policy
              ? 'Active'
              : 'Processing'
          }
          statusType={
            policy
              ? 'success'
              : 'pending'
          }
         onPress={openPolicy}
        />

        <DashCard
          icon={
            <Gift
              size={22}
              color={colors.orange}
            />
          }
          iconBackground="#FFF4E5"
          title="My Rewards"
          text={
            reward
              ? 'Your scratch card is ready'
              : 'No active reward available'
          }
          status={
            reward
              ? 'Available'
              : 'No Reward'
          }
          statusType={
            reward
              ? 'reward'
              : 'neutral'
          }
          onPress={() =>
            navigation.navigate('Scratch')
          }
        />

        <DashCard
          icon={
            <UsersRound
              size={22}
              color={colors.success}
            />
          }
          iconBackground="#EAF8F1"
          title="Refer & Earn ₹100"
          text="Refer a friend and earn after their policy is completed"
          status="Earn ₹100"
          statusType="success"
          onPress={() =>
            navigation.navigate('Referral')
          }
        />

      </View>

    </Screen>
  );
}


/* ================================================= */
/* DASH CARD */
/* ================================================= */

function DashCard({
  icon,
  iconBackground,
  title,
  text,
  status,
  statusType,
  onPress,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >

      <View
        style={[
          styles.cardIcon,
          { backgroundColor: iconBackground },
        ]}
      >
        {icon}
      </View>

      <View style={styles.cardCopy}>

        <View style={styles.cardTitleRow}>

          <Text
            style={styles.cardTitle}
            numberOfLines={1}
          >
            {title}
          </Text>

        </View>

        <Text
          style={styles.cardText}
          numberOfLines={2}
        >
          {text}
        </Text>

        <View
          style={[
            styles.cardStatus,
            statusType === 'success' &&
              styles.cardStatusSuccess,
            statusType === 'pending' &&
              styles.cardStatusPending,
            statusType === 'reward' &&
              styles.cardStatusReward,
            statusType === 'neutral' &&
              styles.cardStatusNeutral,
          ]}
        >
          <Text
            style={[
              styles.cardStatusText,
              statusType === 'success' &&
                styles.statusSuccessText,
              statusType === 'pending' &&
                styles.statusPendingText,
              statusType === 'reward' &&
                styles.statusRewardText,
              statusType === 'neutral' &&
                styles.statusNeutralText,
            ]}
          >
            {status}
          </Text>
        </View>

      </View>

      <View style={styles.arrow}>

        <ChevronRight
          size={19}
          color="#8D9AAF"
        />

      </View>

    </Pressable>
  );
}


/* ================================================= */
/* NAV */
/* ================================================= */

function Nav({
  icon,
  label,
  onPress,
  active,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navItem,
        active && styles.navItemActive,
        pressed && styles.navPressed,
      ]}
    >

      <View
        style={[
          styles.navIcon,
          active && styles.navIconActive,
        ]}
      >
        {React.cloneElement(icon, {
          color: active
            ? colors.blue
            : '#8A96A8',
        })}
      </View>

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

  content: {
    paddingTop: 17,
    paddingBottom: 28,
  },

  /* ================= TOP ================= */

  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 19,
  },

  greeting: {
    flex: 1,
    paddingRight: 12,
  },

  hello: {
    fontSize: 11.5,
    color: colors.muted,
    fontWeight: '600',
  },

  name: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.navy,
    marginTop: 3,
  },

  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  topAction: {
    width: 42,
    height: 42,
    borderRadius: 14,
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

  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.orange,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },

  /* ================= HERO ================= */

  hero: {
    borderRadius: 23,
    backgroundColor: colors.blue,
    paddingHorizontal: 18,
    paddingVertical: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 21,

    shadowColor: colors.blue,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.16,
    shadowRadius: 12,

    elevation: 4,
  },

  heroContent: {
    flex: 1,
    paddingRight: 8,
  },

  heroKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7FE1A8',
    marginRight: 6,
  },

  heroKicker: {
    fontSize: 9,
    fontWeight: '900',
    color: '#D8E6FF',
    letterSpacing: 1,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    marginTop: 5,
  },

  heroSub: {
    fontSize: 10.5,
    color: '#E5EEFF',
    marginTop: 4,
  },

  heroStatus: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 11,
  },

  heroStatusText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#DDF5E8',
    marginLeft: 5,
  },

  heroCarCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ================= SECTION ================= */

  sectionHeading: {
    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.navy,
  },

  sectionSub: {
    fontSize: 9.5,
    color: colors.muted,
    marginTop: 2,
  },

  /* ================= CARDS ================= */

  cards: {
    gap: 10,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 13,
    paddingVertical: 13,
    minHeight: 94,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.035,
    shadowRadius: 8,

    elevation: 1,
  },

  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },

  cardIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardCopy: {
    flex: 1,
    marginHorizontal: 11,
    minWidth: 0,
  },

  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: colors.navy,
    flex: 1,
  },

  cardText: {
    fontSize: 9.5,
    lineHeight: 14,
    color: colors.muted,
    marginTop: 3,
  },

  cardStatus: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 6,
  },

  cardStatusSuccess: {
    backgroundColor: '#EAF8F1',
  },

  cardStatusPending: {
    backgroundColor: '#FFF4E5',
  },

  cardStatusReward: {
    backgroundColor: '#FFF4E5',
  },

  cardStatusNeutral: {
    backgroundColor: '#F2F4F7',
  },

  cardStatusText: {
    fontSize: 7.5,
    fontWeight: '900',
  },

  statusSuccessText: {
    color: colors.success,
  },

  statusPendingText: {
    color: '#C47A19',
  },

  statusRewardText: {
    color: colors.orange,
  },

  statusNeutralText: {
    color: colors.muted,
  },

  arrow: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ================= TRUST ================= */

  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: '#E2EAF8',
    borderRadius: 16,
    padding: 12,
    marginTop: 15,
  },

  trustIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trustContent: {
    flex: 1,
    marginLeft: 9,
  },

  trustTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: colors.navy,
    marginBottom: 2,
  },

  trustText: {
    fontSize: 9,
    lineHeight: 13,
    color: colors.muted,
  },

  /* ================= BOTTOM NAV ================= */

  bottomNav: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },

  navItem: {
    flex: 1,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navItemActive: {
    backgroundColor: '#F2F6FF',
    borderRadius: 15,
    marginHorizontal: 3,
  },

  navIcon: {
    width: 28,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIconActive: {
    backgroundColor: '#E5EEFF',
    borderRadius: 9,
    width: 34,
    height: 28,
  },

  navText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8A96A8',
    marginTop: 3,
  },

  navTextActive: {
    color: colors.blue,
  },

  navPressed: {
    opacity: 0.65,
  },
});