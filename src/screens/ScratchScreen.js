import React, { useEffect, useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  CarFront,
  Check,
  Gift,
  LogOut,
  RotateCcw,
  Sparkles,
  UserRound,
  UsersRound,
  Wallet,
} from 'lucide-react-native';

import Screen from '../components/Screen';
import ScratchCard from '../components/ScratchCard';

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
  const [hasPastRewards, setHasPastRewards] = useState(false);

  // API fail hone par foil dobara lagane ke liye
  const [cardKey, setCardKey] = useState(0);

  useEffect(() => {
    loadReward();
  }, []);

  /* ================================================= */
  /* TOTAL REWARD                                      */
  /* Sirf SCRATCH ho chuke cards ka total               */
  /* ================================================= */

  const refreshTotal = async () => {
    try {
      const history = await policyApi.history();
      const cards = history?.cards || [];

      setTotalReward(calculateTotal(cards));
      setHasPastRewards(cards.some(isCardScratched));
    } catch (error) {
      console.log(
        'History error:',
        error?.message
      );
    }
  };

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
        const cards = historyResult.value?.cards || [];

        setTotalReward(calculateTotal(cards));
        setHasPastRewards(cards.some(isCardScratched));
      } else {
        setTotalReward(0);
      }
    } catch (error) {
      Alert.alert(
        'Unable to load rewards',
        error?.message || 'Please try again.'
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
  /* SCRATCH                                           */
  /* Card scratch hone ke baad hi API call hoti hai    */
  /* ================================================= */

  const handleReveal = async () => {
    if (scratching) return;

    setScratching(true);

    try {
      const result = await policyApi.scratch();

      if (result?.card) {
        setCard(result.card);
      } else {
        // Server ne card nahi bheja to local me scratched mark karo
        setCard((prev) =>
          prev
            ? {
                ...prev,
                isScratched: true,
                status: 'scratched',
              }
            : prev
        );
      }

      // Ab total badhega (history se, scratched cards ka)
      await refreshTotal();
    } catch (error) {
      // Foil wapas laga do, user dobara try kar sake
      setCardKey((key) => key + 1);

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
  const isScratched = isCardScratched(card);
  const isIssued = isCardIssued(card) || isScratched;

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
      {/* TOTAL REWARD (sirf scratched rewards)             */}
      {/* ================================================= */}

      <View style={styles.totalCard}>
        <View style={styles.totalCopy}>
          <Text style={styles.totalLabel}>
            TOTAL REWARD
          </Text>

          <Text style={styles.totalAmount}>
            ₹{totalReward}
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
      {/* MAIN REWARD                                       */}
      {/* ================================================= */}

      <View style={styles.rewardSection}>
        {isIssued ? (
          <>
            <ScratchCard
              key={cardKey}
              amount={rewardAmount}
              revealed={isScratched}
              onReveal={handleReveal}
            />

            {!isScratched && (
              <View style={styles.availableInfo}>
                <Sparkles
                  size={17}
                  color={colors.orange}
                />

                <Text style={styles.availableText}>
                  {scratching
                    ? 'Revealing your reward...'
                    : 'Scratch the card to reveal your cashback'}
                </Text>
              </View>
            )}

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
                    Your ₹{rewardAmount} cashback
                    reward has been successfully
                    revealed.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyGlow}>
              <View style={styles.emptyIcon}>
                {hasPastRewards ? (
                  <Check
                    size={34}
                    color={colors.success}
                    strokeWidth={3}
                  />
                ) : (
                  <Gift
                    size={34}
                    color={colors.blue}
                  />
                )}
              </View>
            </View>

            <Text style={styles.emptyTitle}>
              {hasPastRewards
                ? "You're all caught up!"
                : 'No scratch card yet'}
            </Text>

            <Text style={styles.emptyText}>
              {hasPastRewards
                ? 'You have no scratch cards to open right now. Whenever a new cashback reward is issued for you, it will show up here.'
                : 'You don\u2019t have any scratch card at the moment. Once your policy is verified and your cashback is issued, your scratch card will appear right here.'}
            </Text>

            <View style={styles.emptyTip}>
            
              <Text style={styles.emptyTipText}>
                Check back soon or tap refresh below
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

// Total me sirf wahi cards jo scratch ho chuke hain
function calculateTotal(cards) {
  return cards
    .filter(isCardScratched)
    .reduce(
      (sum, item) => sum + getRewardAmount(item),
      0
    );
}

/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({
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
    transform: [{ scale: 0.96 }],
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
    marginBottom: 18,
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

  /* ================= REWARD ================= */

  rewardSection: {
    alignItems: 'center',
    marginTop: 2,
  },

  /* ================= EMPTY STATE ================= */

  emptyCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: 'center',
  },

  emptyGlow: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#DCE8FB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.navy,
    marginTop: 16,
  },

  emptyText: {
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
  },

  emptyTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8ED',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginTop: 16,
    gap: 7,
  },

  emptyTipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9A6A1E',
  },

  /* ================= AVAILABLE ================= */

  availableInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  availableText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    marginLeft: 7,
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