import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Bell,
  CarFront,
  ChevronRight,
  Edit3,
  Gift,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react-native';

import Screen from '../components/Screen';

import {
  clearToken,
  userApi,
} from '../services/api';

import { colors } from '../theme/theme';


export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);


  useEffect(() => {
    loadProfile();
  }, []);


  /* ================= LOAD PROFILE ================= */

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await userApi.me();

      const currentUser = response?.user || null;

      setUser(currentUser);

      setName(currentUser?.name || '');
      setEmail(currentUser?.email || '');
    } catch (error) {
      Alert.alert(
        'Unable to load profile',
        error?.message || 'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };


  /* ================= LOGOUT ================= */

  const logout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearToken();

            navigation.reset({
              index: 0,
              routes: [{ name: 'Splash' }],
            });
          },
        },
      ]
    );
  };


  /* ================= EDIT PROFILE ================= */

  const openEditProfile = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setEditOpen(true);
  };


  /* ================= SAVE PROFILE ================= */

  const saveProfile = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      Alert.alert(
        'Required',
        'Please enter your name.'
      );
      return;
    }

    if (!trimmedEmail) {
      Alert.alert(
        'Required',
        'Please enter your email.'
      );
      return;
    }

    setSavingProfile(true);

    try {
      const response = await userApi.updateProfile({
        name: trimmedName,
        email: trimmedEmail,
      });

      const updatedUser =
        response?.user || {
          ...user,
          name: trimmedName,
          email: trimmedEmail,
        };

      setUser(updatedUser);

      setName(updatedUser?.name || trimmedName);
      setEmail(updatedUser?.email || trimmedEmail);

      setEditOpen(false);

      Alert.alert(
        'Success',
        response?.message ||
          'Profile updated successfully.'
      );
    } catch (error) {
      Alert.alert(
        'Unable to update profile',
        error?.message ||
          'Please try again.'
      );
    } finally {
      setSavingProfile(false);
    }
  };


  /* ================= LOADING ================= */

  if (loading) {
    return (
      <Screen
        contentStyle={styles.loadingContainer}
        footer={
          <BottomNav
            navigation={navigation}
            active="Profile"
          />
        }
      >
        <ActivityIndicator
          size="large"
          color={colors.blue}
        />
      </Screen>
    );
  }


  const firstLetter =
    user?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || 'U';


  const firstName =
    user?.name
      ?.trim() ||
    user?.phone ||
    'Policyholder';


  return (
    <Screen
      contentStyle={styles.content}
      footer={
        <BottomNav
          navigation={navigation}
          active="Profile"
        />
      }
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <View style={styles.top}>

        <View style={styles.greeting}>

          <Text style={styles.hello}>
            Welcome back
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
      {/* PROFILE HERO */}
      {/* ================================================= */}

      <View style={styles.profileHero}>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {firstLetter}
          </Text>
        </View>


        <View style={styles.profileHeroCopy}>

          <Text style={styles.profileName}>
            {user?.name || 'Policyholder'}
          </Text>

          <Text style={styles.profilePhone}>
            {user?.phone || 'Phone not available'}
          </Text>


          <View style={styles.verifiedBadge}>

            <ShieldCheck
              size={13}
              color={colors.success}
            />

            <Text style={styles.verifiedText}>
              {user?.isVerified
                ? 'Verified Account'
                : 'Account'}
            </Text>

          </View>

        </View>


        <Pressable
          style={({ pressed }) => [
            styles.editIconButton,
            pressed && styles.pressed,
          ]}
          onPress={openEditProfile}
        >
          <Edit3
            size={18}
            color={colors.blue}
          />
        </Pressable>

      </View>


      {/* ================================================= */}
      {/* PERSONAL INFORMATION */}
      {/* ================================================= */}

      <View style={styles.sectionHeader}>

        <View>

          <Text style={styles.sectionTitle}>
            Personal Information
          </Text>

          <Text style={styles.sectionSub}>
            Your account details
          </Text>

        </View>

      </View>


      <View style={styles.card}>

        <InfoRow
          icon={
            <UserRound
              size={19}
              color={colors.blue}
            />
          }
          label="Full Name"
          value={user?.name || 'Not added'}
        />

        <Divider />

        <InfoRow
          icon={
            <Mail
              size={19}
              color={colors.blue}
            />
          }
          label="Email Address"
          value={user?.email || 'Not added'}
        />

        <Divider />

        <InfoRow
          icon={
            <Phone
              size={19}
              color={colors.blue}
            />
          }
          label="Mobile Number"
          value={user?.phone || 'Not available'}
        />

      </View>


      {/* ================================================= */}
      {/* ACCOUNT */}
      {/* ================================================= */}

      <View style={styles.sectionHeader}>

        <View>

          <Text style={styles.sectionTitle}>
            Account & Security
          </Text>

          <Text style={styles.sectionSub}>
            Manage your account
          </Text>

        </View>

      </View>


      <View style={styles.card}>

        <ActionRow
          icon={
            <Edit3
              size={19}
              color={colors.blue}
            />
          }
          title="Edit Profile"
          subtitle="Update your name and email"
          onPress={openEditProfile}
        />

      </View>


      {/* ================================================= */}
      {/* LOGOUT */}
      {/* ================================================= */}

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutPressed,
        ]}
        onPress={logout}
      >

        <View style={styles.logoutIcon}>

          <LogOut
            size={19}
            color={colors.danger}
          />

        </View>

        <Text style={styles.logoutText}>
          Logout
        </Text>

      </Pressable>


      {/* ================================================= */}
      {/* EDIT PROFILE MODAL */}
      {/* ================================================= */}

      <Modal
        visible={editOpen}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setEditOpen(false)
        }
      >

        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >

          <View style={styles.modalCard}>

            <View style={styles.modalHeader}>

              <View>

                <Text style={styles.modalTitle}>
                  Edit Profile
                </Text>

                <Text style={styles.modalSub}>
                  Update your account details
                </Text>

              </View>


              <Pressable
                style={styles.closeButton}
                onPress={() =>
                  setEditOpen(false)
                }
              >
                <X
                  size={20}
                  color={colors.navy}
                />
              </Pressable>

            </View>


            {/* NAME */}

            <Text style={styles.inputLabel}>
              Full Name
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#9AA7B8"
              style={styles.input}
              autoCapitalize="words"
            />


            {/* EMAIL */}

            <Text style={styles.inputLabel}>
              Email Address
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9AA7B8"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />


            {/* MOBILE - READ ONLY */}

            <Text style={styles.inputLabel}>
              Mobile Number
            </Text>

            <View
              style={[
                styles.input,
                styles.disabledInput,
              ]}
            >
              <Text style={styles.disabledText}>
                {user?.phone || 'Not available'}
              </Text>
            </View>


            {/* SAVE */}

            <Pressable
              style={[
                styles.primaryButton,
                savingProfile &&
                  styles.primaryButtonDisabled,
              ]}
              onPress={saveProfile}
              disabled={savingProfile}
            >

              {savingProfile ? (
                <ActivityIndicator
                  color={colors.white}
                />
              ) : (
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Save Changes
                </Text>
              )}

            </Pressable>

          </View>

        </KeyboardAvoidingView>

      </Modal>

    </Screen>
  );
}


/* ================================================= */
/* BOTTOM NAV */
/* ================================================= */

function BottomNav({
  navigation,
  active,
}) {
  return (
    <View style={styles.bottomNav}>

      <Nav
        icon={<CarFront size={21} />}
        label="Home"
        active={active === 'Home'}
        onPress={() =>
          navigation.navigate('Home')
        }
      />

      <Nav
        icon={<Gift size={21} />}
        label="Rewards"
        active={active === 'Scratch'}
        onPress={() =>
          navigation.navigate('Scratch')
        }
      />

      <Nav
        icon={<UsersRound size={21} />}
        label="Refer"
        active={active === 'Referral'}
        onPress={() =>
          navigation.navigate('Referral')
        }
      />

      <Nav
        icon={<UserRound size={21} />}
        label="Profile"
        active={active === 'Profile'}
        onPress={() =>
          navigation.navigate('Profile')
        }
      />

    </View>
  );
}


/* ================================================= */
/* NAV ITEM */
/* ================================================= */

function Nav({
  icon,
  label,
  active,
  onPress,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.navItem,
        active && styles.navItemActive,
        pressed && styles.navPressed,
      ]}
      onPress={onPress}
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
/* INFO ROW */
/* ================================================= */

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <View style={styles.infoRow}>

      <View style={styles.infoIcon}>
        {icon}
      </View>

      <View style={styles.infoCopy}>

        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text
          style={styles.infoValue}
          numberOfLines={1}
        >
          {value}
        </Text>

      </View>

    </View>
  );
}


/* ================================================= */
/* ACTION ROW */
/* ================================================= */

function ActionRow({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionRow,
        pressed && styles.actionPressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >

      <View style={styles.actionIcon}>
        {icon}
      </View>

      <View style={styles.actionCopy}>

        <Text style={styles.actionTitle}>
          {title}
        </Text>

        <Text style={styles.actionSub}>
          {subtitle}
        </Text>

      </View>

      {showArrow && (
        <ChevronRight
          size={19}
          color="#9AA7B8"
        />
      )}

    </Pressable>
  );
}


/* ================================================= */
/* DIVIDER */
/* ================================================= */

function Divider() {
  return (
    <View style={styles.divider} />
  );
}


/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

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


  /* ================= PROFILE HERO ================= */

  profileHero: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 21,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.white,
    fontSize: 25,
    fontWeight: '900',
  },

  profileHeroCopy: {
    flex: 1,
    marginLeft: 13,
  },

  profileName: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.navy,
  },

  profilePhone: {
    fontSize: 10.5,
    color: colors.muted,
    marginTop: 3,
  },

  verifiedBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF8F1',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 7,
  },

  verifiedText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.success,
    marginLeft: 4,
  },

  editIconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },


  /* ================= SECTION ================= */

  sectionHeader: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.navy,
  },

  sectionSub: {
    fontSize: 9.5,
    color: colors.muted,
    marginTop: 2,
  },


  /* ================= CARD ================= */

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 13,
    marginBottom: 20,
  },

  infoRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoCopy: {
    flex: 1,
    marginLeft: 11,
  },

  infoLabel: {
    fontSize: 9,
    color: colors.muted,
    fontWeight: '700',
  },

  infoValue: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: '800',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF1F5',
  },


  /* ================= ACTION ================= */

  actionRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionPressed: {
    opacity: 0.65,
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionCopy: {
    flex: 1,
    marginLeft: 11,
    paddingRight: 10,
  },

  actionTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.navy,
  },

  actionSub: {
    fontSize: 9.5,
    color: colors.muted,
    marginTop: 3,
  },


  /* ================= LOGOUT ================= */

  logoutButton: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F0CACA',
    backgroundColor: '#FFF8F8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  logoutPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.985 }],
  },

  logoutIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#FFECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.danger,
    marginLeft: 8,
  },

  version: {
    textAlign: 'center',
    fontSize: 8.5,
    color: '#A0A9B7',
    marginTop: 13,
  },


  /* ================= MODAL ================= */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,24,45,0.45)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.navy,
  },

  modalSub: {
    fontSize: 9.5,
    color: colors.muted,
    marginTop: 3,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },


  /* ================= INPUT ================= */

  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 7,
  },

  input: {
    height: 49,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    fontSize: 12,
    color: colors.navy,
    backgroundColor: colors.white,
    marginBottom: 15,
  },

  disabledInput: {
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },

  disabledText: {
    color: colors.muted,
    fontSize: 12,
  },

  primaryButton: {
    height: 51,
    borderRadius: 14,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  primaryButtonDisabled: {
    opacity: 0.65,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
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


  /* ================= PRESSED ================= */

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },

});