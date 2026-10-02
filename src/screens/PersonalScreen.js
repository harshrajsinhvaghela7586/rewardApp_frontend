import React, { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import Screen from '../components/Screen';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Progress from '../components/Progress';

import { validEmail, validName } from '../utils/picker';
import { colors, spacing } from '../theme/theme';

export default function PersonalScreen({ navigation, route }) {
  const form = route.params?.form || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [mobile] = useState(form.phone || '');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    // Android cancel
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (!selectedDate) {
      return;
    }

    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();

    setDob(`${day}/${month}/${year}`);
  };

  const handleContinue = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Mobile must be exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (!validName(trimmedName)) {
      Alert.alert(
        'Invalid Name',
        'Please enter your full name using letters only.'
      );
      return;
    }

    if (!validEmail(trimmedEmail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return;
    }

    if (!dob) {
      Alert.alert(
        'Date of Birth Required',
        'Please select your date of birth.'
      );
      return;
    }

    setLoading(true);

    navigation.navigate('Kyc', {
      form: {
        ...form,
        name: trimmedName,
        email: trimmedEmail,
        dob,
        mobile,
      },
    });

    setLoading(false);
  };

  return (
    <Screen>
      <Progress current={2} />

      <Header
        title="Tell us about yourself"
        step="03"
        subtitle="These details help us prepare your insurance request."
      />

      <View style={styles.form}>
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          autoCapitalize="words"
          error={
            name && !validName(name)
              ? 'Name can contain letters only'
              : ''
          }
        />

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter your email"
          error={
            email && !validEmail(email)
              ? 'Enter a valid email'
              : ''
          }
        />

        {/* Date of Birth */}
        <View style={styles.field}>
          <Text style={styles.label}>Date of Birth</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !dob && styles.placeholder,
              ]}
            >
              {dob || 'Select your date of birth'}
            </Text>

            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Mobile Number */}
        <Input
          label="Mobile Number"
          value={mobile}
          editable={false}
          keyboardType="number-pad"
          maxLength={10}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          🔒 Your information is secure
        </Text>

        <Text style={styles.infoText}>
          Your personal details are securely stored and used only
          for processing your insurance request.
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
  form: {
    marginTop: spacing.sm,
  },

  field: {
    marginBottom: spacing.md,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 7,
  },

  dateInput: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateText: {
    fontSize: 14,
    color: colors.text,
  },

  placeholder: {
    color: colors.muted,
  },

  calendarIcon: {
    fontSize: 18,
  },

  infoCard: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
});