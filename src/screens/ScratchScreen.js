import React, { useEffect, useState } from 'react';

import {
  Alert,
  Pressable,
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
  RotateCcw,
  Sparkles,
  Trophy,
  UserRound,
  UsersRound,
  Wallet,
} from 'lucide-react-native';

import Screen from '../components/Screen';

import {
  policyApi,
  clearToken,
  userApi,
} from '../services/api';

import { colors } from '../theme/theme';

export default function ScratchScreen({
  navigation,
}) {
  const [user, setUser] = useState(null);
  const [card, setCard] = useState(null);
const [totalReward, setTotalReward] = useState(0);
const [loading, setLoading] = useState(true);
const [scratching, setScratching] = useState(false);

  useEffect(() => {
    loadReward();
  }, []);

const loadReward = async () => {
  setLoading(true);

  try {
    const userResponse = await userApi.me();

    setUser(userResponse?.user || null);

    const [currentCardResult, historyResult] =
      await Promise.allSettled([
        policyApi.myScratchCard(),
        policyApi.history(),
      ]);

    // ================= CURRENT SCRATCH CARD =================

    if (currentCardResult.status === 'fulfilled') {
      setCard(
        currentCardResult.value?.card || null
      );
    } else if (
      currentCardResult.reason?.status === 404
    ) {
      setCard(null);
    } else {
      throw currentCardResult.reason;
    }

    // ================= TOTAL REWARD =================

    if (historyResult.status === 'fulfilled') {
      const cards =
        historyResult.value?.cards || [];

      const total = cards.reduce(
        (sum, item) =>
          sum + Number(item?.amount || 0),
        0
      );

      setTotalReward(total);
    } else {
      setTotalReward(0);
    }

  } catch (error) {
    Alert.alert(
      'Unable to load rewards',
      error?.message ||
        'Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

  /* ================================================= */
  /* LOGOUT */
  /* ================================================= */

  const logout = async () => {
    await clearToken();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Splash' }],
    });
  };

  /* ================================================= */
  /* SCRATCH */
  /* ================================================= */

  const handleScratch = async () => {
  if (scratching) return;

  setScratching(true);

  try {
    const result = await policyApi.scratch();

    if (result?.card) {
      setCard(result.card);
    }

    // Scratch ke baad total reward recalculate karo
    await loadReward();

  } catch (error) {
    Alert.alert(
      'Reward unavailable',
      error?.message ||
        'Your reward is not available yet.'
    );
  } finally {
    setScratching(false);
  }
};


  /* ================================================= */
  /* REWARD DATA */
  /* ================================================= */

  const rewardAmount = getRewardAmount(card);
const totalAmount = totalReward;
  const isIssued = isCardIssued(card);

  const isScratched = isCardScratched(card);

  /* ================================================= */
  /* SCREEN */
  /* ================================================= */

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
            active
          />

          <NavItem
            icon={<UsersRound size={21} />}
            label="Refer"
            onPress={() =>
              navigation.navigate('Referral')
            }
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
      {/* HEADER */}
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

          {/* Notification */}

          

          {/* Logout */}

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
      {/* TOTAL REWARD */}
      {/* ================================================= */}

      <View style={styles.totalCard}>

        <View style={styles.totalCopy}>

          <Text style={styles.totalLabel}>
            TOTAL REWARD
          </Text>

          <Text style={styles.totalAmount}>
  ₹{totalAmount}
</Text>

          <Text style={styles.totalSub}>
            Cashback earned from your insurance
          </Text>

        </View>

        <View style={styles.walletCircle}>
          <Wallet
            size={27}
            color={colors.white}
          />
        </View>

      </View>

      {/* ================================================= */}
      {/* MAIN REWARD */}
      {/* ================================================= */}

      <View style={styles.rewardSection}>

        <View style={styles.rewardGlow}>

          <View style={styles.rewardCircle}>

            {isScratched ? (
              <>
                <View style={styles.rewardIconSuccess}>
                  <Trophy
                    size={31}
                    color={colors.orange}
                  />
                </View>

                <Text style={styles.rewardWon}>
                  ₹{rewardAmount}
                </Text>

                <Text style={styles.rewardWonLabel}>
                  Reward Received
                </Text>
              </>
            ) : isIssued ? (
              <>
                <View style={styles.rewardIconAvailable}>
                  <Gift
                    size={34}
                    color={colors.orange}
                  />
                </View>

                <Text
                  style={styles.rewardCenterTitle}
                >
                  Scratch & Reveal
                </Text>

                <Text
                  style={styles.rewardCenterSub}
                >
                  Your cashback is waiting
                </Text>
              </>
            ) : (
              <>
                <View style={styles.rewardIconPending}>
                  <Gift
                    size={34}
                    color="#9AA7B8"
                  />
                </View>

                <Text
                  style={styles.rewardCenterTitle}
                >
                  Reward Pending
                </Text>

                <Text
                  style={styles.rewardCenterSub}
                >
                  Your reward will appear here
                </Text>
              </>
            )}

          </View>

        </View>

        {/* ================================================= */}
        {/* PENDING MESSAGE */}
        {/* ================================================= */}

        {!isIssued && !isScratched && (
          <View style={styles.messageBox}>

            <View style={styles.messageIcon}>
              <Sparkles
                size={18}
                color={colors.orange}
              />
            </View>

            <View style={styles.messageCopy}>

              <Text style={styles.messageTitle}>
                Reward pending
              </Text>

              <Text style={styles.messageText}>
                Your scratch card has not been issued
                yet. Once the admin issues your cashback
                reward, it will appear here.
              </Text>

            </View>

          </View>
        )}

        {/* ================================================= */}
        {/* AVAILABLE REWARD */}
        {/* ================================================= */}

        {isIssued && !isScratched && (
          <View style={styles.availableArea}>

            <View style={styles.availableInfo}>
              <Sparkles
                size={17}
                color={colors.orange}
              />

              <Text style={styles.availableText}>
                Your cashback reward is ready to reveal
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.scratchButton,
                pressed && styles.pressedButton,
              ]}
              onPress={handleScratch}
              disabled={scratching}
            >

              <Gift
                size={19}
                color={colors.white}
              />

              <Text style={styles.scratchButtonText}>
                {scratching
                  ? 'Revealing...'
                  : 'Scratch & Reveal Reward'}
              </Text>

            </Pressable>

          </View>
        )}

        {/* ================================================= */}
        {/* SCRATCHED / RECEIVED */}
        {/* ================================================= */}

        {isScratched && (
          <View style={styles.receivedBox}>

            <View style={styles.receivedIcon}>
              <Check
                size={17}
                color={colors.success}
                strokeWidth={3}
              />
            </View>

            <View style={styles.receivedCopy}>

              <Text style={styles.receivedTitle}>
                Reward revealed
              </Text>

              <Text style={styles.receivedText}>
                Your ₹{rewardAmount} cashback reward
                has been successfully revealed.
              </Text>

            </View>

          </View>
        )}

      </View>

      {/* ================================================= */}
      {/* REFRESH */}
      {/* ================================================= */}

      <Pressable
        style={({ pressed }) => [
          styles.refresh,
          pressed && styles.refreshPressed,
        ]}
        onPress={loadReward}
        disabled={loading}
      >

        <RotateCcw
          size={15}
          color={colors.blue}
        />

        <Text style={styles.refreshText}>
          {loading
            ? 'Refreshing...'
            : 'Refresh reward status'}
        </Text>

      </Pressable>

    </Screen>
  );
}

/* ================================================= */
/* REWARD LEVEL */
/* ================================================= */

function RewardLevel({
  amount,
  active,
}) {
  return (
    <View
      style={[
        styles.levelItem,
        active && styles.levelItemActive,
      ]}
    >

      <View
        style={[
          styles.levelCircle,
          active && styles.levelCircleActive,
        ]}
      >
        {active && (
          <Check
            size={14}
            color={colors.white}
            strokeWidth={3}
          />
        )}
      </View>

      <Text
        style={[
          styles.levelAmount,
          active && styles.levelAmountActive,
        ]}
      >
        {amount}
      </Text>

    </View>
  );
}

/* ================================================= */
/* BOTTOM NAV ITEM */
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
/* HELPERS */
/* ================================================= */

function getRewardAmount(card) {
  if (!card) return 0;

  return Number(
    card.rewardAmount ??
      card.amount ??
      card.cashback ??
      card.reward ??
      0
  );
}

function isCardIssued(card) {
  if (!card) return false;

  return (
    card.isIssued === true ||
    card.issued === true ||
    card.status === 'issued' ||
    card.status === 'available' ||
    !!card.issuedAt
  );
}

function isCardScratched(card) {
  if (!card) return false;

  return (
    card.isScratched === true ||
    card.scratched === true ||
    card.status === 'scratched' ||
    !!card.scratchedAt
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

  /* ================= PAGE TITLE ================= */

  pageTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  titleCopy: {
    flex: 1,
  },

  pageKicker: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.blue,
    letterSpacing: 1.2,
  },

  title: {
    fontSize: 25,
    fontWeight: '900',
    color: colors.navy,
    marginTop: 2,
  },

  subtitle: {
    fontSize: 10.5,
    color: colors.muted,
    marginTop: 3,
  },

  titleIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFF4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  /* ================= TOTAL CARD ================= */

  totalCard: {
    backgroundColor: colors.blue,
    borderRadius: 21,
    paddingHorizontal: 20,
    paddingVertical: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  totalCopy: {
    flex: 1,
  },

  totalLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#CFE0FF',
    letterSpacing: 1,
  },

  totalAmount: {
    fontSize: 31,
    fontWeight: '900',
    color: colors.white,
    marginTop: 2,
  },

  totalSub: {
    fontSize: 10,
    color: '#E3ECFF',
    marginTop: 3,
  },

  walletCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  /* ================= LEVEL CARD ================= */

  levelCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 17,
  },

  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  levelTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.navy,
  },

  levelHint: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.muted,
  },

  levels: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  levelItem: {
    alignItems: 'center',
    minWidth: 52,
  },

  levelItemActive: {
    transform: [
      {
        scale: 1.04,
      },
    ],
  },

  levelCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2F6',
    borderWidth: 1,
    borderColor: '#D7DEE8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  levelCircleActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },

  levelAmount: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A96A8',
    marginTop: 5,
  },

  levelAmountActive: {
    color: colors.blue,
    fontWeight: '900',
  },

  levelLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5EAF1',
    marginHorizontal: 4,
    marginBottom: 17,
  },

  /* ================= REWARD ================= */

  rewardSection: {
    alignItems: 'center',
    marginTop: 2,
  },

  rewardGlow: {
    width: 205,
    height: 205,
    borderRadius: 103,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rewardCircle: {
    width: 165,
    height: 165,
    borderRadius: 83,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#E7ECF3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  rewardIconPending: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#F1F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rewardIconAvailable: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#FFF4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rewardIconSuccess: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#FFF4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rewardCenterTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.navy,
    textAlign: 'center',
    marginTop: 9,
  },

  rewardCenterSub: {
    fontSize: 9.5,
    lineHeight: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 5,
  },

  rewardWon: {
    fontSize: 29,
    fontWeight: '900',
    color: colors.navy,
    marginTop: 6,
  },

  rewardWonLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
    marginTop: 2,
  },

  /* ================= PENDING ================= */

  messageBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8ED',
    borderRadius: 15,
    padding: 13,
    marginTop: 16,
  },

  messageIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#FFF0D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  messageCopy: {
    flex: 1,
    marginLeft: 9,
  },

  messageTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.navy,
  },

  messageText: {
    fontSize: 9.5,
    lineHeight: 15,
    color: colors.muted,
    marginTop: 3,
  },

  /* ================= AVAILABLE ================= */

  availableArea: {
    width: '100%',
    marginTop: 16,
  },

  availableInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  availableText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
    marginLeft: 7,
  },

  scratchButton: {
    width: '100%',
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  scratchButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.white,
  },

  pressedButton: {
    opacity: 0.8,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  /* ================= RECEIVED ================= */

  receivedBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFAF3',
    borderRadius: 15,
    padding: 13,
    marginTop: 16,
  },

  receivedIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: '#D9F4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  receivedCopy: {
    flex: 1,
    marginLeft: 9,
  },

  receivedTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.success,
  },

  receivedText: {
    fontSize: 9.5,
    lineHeight: 15,
    color: '#47715E',
    marginTop: 2,
  },

  /* ================= REFRESH ================= */

  refresh: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 15,
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  refreshPressed: {
    opacity: 0.6,
  },

  refreshText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.blue,
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