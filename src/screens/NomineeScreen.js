import React, { useState } from 'react';

import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { UserRound } from 'lucide-react-native';

import Screen from '../components/Screen';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Progress from '../components/Progress';

import { colors, radius, spacing } from '../theme/theme';
import { validName } from '../utils/picker';

export default function NomineeScreen({ navigation, route }) {
  const form = route.params?.form || {};

  const [nominee, setNominee] = useState({
    name: '',
    relationship: '',
    dob: '',
    mobile: '',
  });

  const [datePicker, setDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key, value) => {
    setNominee((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setDatePicker(false);
    }

    if (!selectedDate) {
      return;
    }

    set('dob', formatDate(selectedDate));
  };

  const handleContinue = () => {
    const valid =
      validName(nominee.name.trim()) &&
      nominee.relationship.trim() &&
      nominee.dob &&
      /^\d{10}$/.test(nominee.mobile);

    if (!valid) {
      Alert.alert(
        'Check nominee details',
        'Please complete all nominee details correctly.'
      );
      return;
    }

    setLoading(true);

    navigation.navigate('Review', {
      form: {
        ...form,

        nominee: {
          ...nominee,
          name: nominee.name.trim(),
          relationship: nominee.relationship.trim(),
          mobile: nominee.mobile.trim(),
        },
      },
    });

    setLoading(false);
  };

  return (
    <Screen>
      <Progress current={4} />

      <Header
        title="Add nominee details"
        step="05"
        subtitle="Add someone who should be associated with your policy."
      />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <UserRound
              size={19}
              color={colors.blue}
            />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.cardTitle}>
              Nominee
            </Text>

            <Text style={styles.cardSubtitle}>
              Required
            </Text>
          </View>

          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>
              Required
            </Text>
          </View>
        </View>

        <Input
          label="Full Name"
          value={nominee.name}
          onChangeText={(value) => set('name', value)}
          placeholder="Enter nominee full name"
          autoCapitalize="words"
          error={
            nominee.name && !validName(nominee.name)
              ? 'Enter a valid name'
              : ''
          }
        />

        <Input
          label="Relationship"
          value={nominee.relationship}
          onChangeText={(value) => set('relationship', value)}
          placeholder="e.g. Spouse, Parent, Sibling"
          autoCapitalize="words"
        />

        <View style={styles.field}>
          <Text style={styles.label}>
            Date of Birth
          </Text>

          <Pressable
            style={styles.dateInput}
            onPress={() => setDatePicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !nominee.dob && styles.placeholder,
              ]}
            >
              {nominee.dob || 'Select date of birth'}
            </Text>

            <Text style={styles.calendar}>
              📅
            </Text>
          </Pressable>
        </View>

        <Input
          label="Mobile Number"
          value={nominee.mobile}
          onChangeText={(value) =>
            set(
              'mobile',
              value.replace(/\D/g, '').slice(0, 10)
            )
          }
          keyboardType="number-pad"
          maxLength={10}
          placeholder="10-digit mobile number"
        />
      </View>

      {datePicker && (
        <DateTimePicker
          value={new Date(2000, 0, 1)}
          mode="date"
          display={
            Platform.OS === 'ios'
              ? 'spinner'
              : 'default'
          }
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          🔒 Nominee information is secure
        </Text>

        <Text style={styles.infoText}>
          Please provide accurate nominee details. This
          information will be associated with your insurance
          application.
        </Text>
      </View>

      <Button
        title="Review & Submit"
        loading={loading}
        onPress={handleContinue}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF5FF',
    marginRight: 10,
  },

  headerText: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },

  cardSubtitle: {
    marginTop: 3,
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
    paddingHorizontal: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
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

  calendar: {
    fontSize: 18,
  },

  infoCard: {
    marginTop: spacing.lg,
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