import React, { useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Check,
  FileCheck2,
  UserRound,
  UsersRound,
  ShieldCheck,
  CarFront,
} from 'lucide-react-native';

import Screen from '../components/Screen';
import Header from '../components/Header';
import Button from '../components/Button';
import FieldCard from '../components/FieldCard';

import { userApi } from '../services/api';
import { colors } from '../theme/theme';

export default function ReviewScreen({ navigation, route }) {
  const form = route.params?.form || {};

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!agree) {
      Alert.alert(
        'Consent required',
        'Please accept the Terms & Conditions and Privacy Policy.'
      );
      return;
    }

    setLoading(true);

    try {
      await userApi.submitProfile(
  {
    name: form.name,
    email: form.email,
    dob: toISO(form.dob),

    claimedPrevious:
      form.claimedPrevious || 'no',

    hasPreviousPolicy:
      form.hasPreviousPolicy === true,

    nomineeName: form.nominee?.name,
    nomineeRelationship:
      form.nominee?.relationship,
    nomineeDob: form.nominee?.dob,
    nomineeMobile: form.nominee?.mobile,
  },
  {
    rc: form.rc,

    policy:
      form.claimedPrevious === 'yes'
        ? form.policy
        : null,

    aadhaarFront: form.aadhaarFront,
    aadhaarBack: form.aadhaarBack,
    pan: form.pan,
  }
);

navigation.replace('ThankYou');
} catch (e) {
      Alert.alert(
        'Submission failed',
        e.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentStyle={styles.content}>
      <Header
        title="Review your details"
        step="06"
        subtitle="Everything looks good? Review once and submit your request."
      />

      <View style={styles.readyCard}>
        <View style={styles.readyIcon}>
          <Check
            size={20}
            color={colors.success}
            strokeWidth={3}
          />
        </View>

        <View style={styles.readyContent}>
          <Text style={styles.readyTitle}>
            Almost done!
          </Text>

          <Text style={styles.readyText}>
            Your application details are ready for submission.
          </Text>
        </View>
      </View>

      <ReviewSection
        icon={<UserRound size={18} color={colors.blue} />}
        title="Personal Details"
        subtitle="Your basic information"
      >
        <FieldCard
          label="Name"
          value={form.name || 'Not provided'}
        />

        <FieldCard
          label="Email"
          value={form.email || 'Not provided'}
        />

        <FieldCard
          label="Date of Birth"
          value={form.dob || 'Not provided'}
        />

        <FieldCard
          label="Mobile"
          value={
            form.mobile ||
            form.phone ||
            'Not provided'
          }
        />
      </ReviewSection>

     <ReviewSection
  icon={<CarFront size={18} color={colors.blue} />}
  title="Vehicle & Insurance"
  subtitle="Vehicle and uploaded documents"
>
  <DocumentRow
    label="RC"
    file={form.rc}
  />

  {form.claimedPrevious === 'yes' && (
    <DocumentRow
      label="Previous Insurance"
      file={form.policy}
      last
    />
  )}

  {form.claimedPrevious === 'no' && (
    <FieldCard
      label="Insurance Claim"
      value="No"
    />
  )}
</ReviewSection>

<ReviewSection
  icon={<FileCheck2 size={18} color={colors.blue} />}
  title="KYC Documents"
  subtitle="Identity verification documents"
>
  <DocumentRow
    label="Aadhaar Front"
    file={form.aadhaarFront}
  />

  <DocumentRow
    label="Aadhaar Back"
    file={form.aadhaarBack}
  />

  <DocumentRow
    label="PAN Card"
    file={form.pan}
    last
  />
</ReviewSection>

      <ReviewSection
        icon={<UsersRound size={18} color={colors.blue} />}
        title="Nominee Details"
        subtitle="Person selected as nominee"
      >
        <FieldCard
          label="Name"
          value={
            form.nominee?.name ||
            'Not provided'
          }
        />

        <FieldCard
          label="Relationship"
          value={
            form.nominee?.relationship ||
            'Not provided'
          }
        />

        <FieldCard
          label="Date of Birth"
          value={
            form.nominee?.dob ||
            'Not provided'
          }
        />

        <FieldCard
          label="Mobile"
          value={
            form.nominee?.mobile ||
            'Not provided'
          }
        />
      </ReviewSection>

      <Pressable
        style={[
          styles.consentCard,
          agree && styles.consentActive,
        ]}
        onPress={() => setAgree(value => !value)}
      >
        <View
          style={[
            styles.checkbox,
            agree && styles.checkboxChecked,
          ]}
        >
          {agree && (
            <Check
              size={15}
              color={colors.white}
              strokeWidth={3}
            />
          )}
        </View>

        <View style={styles.consentContent}>
          <Text style={styles.consentTitle}>
            Confirmation & Consent
          </Text>

          <Text style={styles.checkText}>
            I confirm that the information provided is
            accurate and I agree to the Terms & Conditions
            and Privacy Policy.
          </Text>
        </View>
      </Pressable>

      <View style={styles.security}>
        <View style={styles.securityIcon}>
          <ShieldCheck
            size={17}
            color={colors.success}
          />
        </View>

        <View style={styles.securityContent}>
          <Text style={styles.securityTitle}>
            Your information is secure
          </Text>

          <Text style={styles.securityText}>
            Your documents are securely processed for
            insurance verification.
          </Text>
        </View>
      </View>

      <View style={styles.submitArea}>
        <Button
          title="Submit Application"
          loading={loading}
          onPress={submit}
        />

        <Text style={styles.submitHint}>
          By submitting, you confirm that all details
          provided above are correct.
        </Text>
      </View>
    </Screen>
  );
}

function ReviewSection({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          {icon}
        </View>

        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>
            {title}
          </Text>

          {subtitle && (
            <Text style={styles.sectionSubtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );
}

function DocumentRow({
  label,
  file,
  last = false,
}) {
  const uploaded = !!file?.uri;

  return (
    <View
      style={[
        styles.documentRow,
        last && styles.documentRowLast,
      ]}
    >
      <View
        style={[
          styles.documentIcon,
          uploaded &&
            styles.documentIconActive,
        ]}
      >
        <FileCheck2
          size={18}
          color={
            uploaded
              ? colors.success
              : '#9AA7B8'
          }
        />
      </View>

      <View style={styles.documentCopy}>
        <Text style={styles.documentLabel}>
          {label}
        </Text>

        <Text
          style={styles.documentName}
          numberOfLines={1}
        >
          {uploaded
            ? file.name || 'Document uploaded'
            : 'Document not uploaded'}
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          uploaded
            ? styles.statusUploaded
            : styles.statusMissing,
        ]}
      >
        <View
          style={[
            styles.statusDot,
            uploaded
              ? styles.statusDotSuccess
              : styles.statusDotDanger,
          ]}
        />

        <Text
          style={[
            styles.statusText,
            uploaded
              ? styles.statusUploadedText
              : styles.statusMissingText,
          ]}
        >
          {uploaded ? 'Ready' : 'Missing'}
        </Text>
      </View>
    </View>
  );
}

function toISO(d) {
  const [day, month, year] =
    String(d || '').split('/');

  if (!day || !month || !year) {
    return d;
  }

  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingBottom: 30,
  },

  readyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FAF5',
    borderWidth: 1,
    borderColor: '#D7F0E3',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
  },

  readyIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#DDF5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  readyContent: {
    flex: 1,
  },

  readyTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#246B4A',
    marginBottom: 3,
  },

  readyText: {
    fontSize: 10.5,
    lineHeight: 15,
    color: '#527466',
  },

  section: {
    marginBottom: 19,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  sectionIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.navy,
  },

  sectionSubtitle: {
    fontSize: 9.5,
    color: colors.muted,
    marginTop: 2,
  },

  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },

  documentRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F5',
  },

  documentRowLast: {
    borderBottomWidth: 0,
  },

  documentIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F3F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  documentIconActive: {
    backgroundColor: '#EAF8F1',
  },

  documentCopy: {
    flex: 1,
    marginHorizontal: 10,
    minWidth: 0,
  },

  documentLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.navy,
  },

  documentName: {
    fontSize: 9.5,
    color: colors.muted,
    marginTop: 4,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusUploaded: {
    backgroundColor: '#EAF8F1',
  },

  statusMissing: {
    backgroundColor: '#FFF2F2',
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  statusDotSuccess: {
    backgroundColor: colors.success,
  },

  statusDotDanger: {
    backgroundColor: colors.danger,
  },

  statusText: {
    fontSize: 8.5,
    fontWeight: '900',
  },

  statusUploadedText: {
    color: colors.success,
  },

  statusMissingText: {
    color: colors.danger,
  },

  consentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 12,
  },

  consentActive: {
    borderColor: colors.blue,
    backgroundColor: '#F7FAFF',
  },

  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#B8C7DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    marginTop: 1,
  },

  checkboxChecked: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },

  consentContent: {
    flex: 1,
  },

  consentTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.navy,
    marginBottom: 4,
  },

  checkText: {
    fontSize: 10.5,
    lineHeight: 16,
    color: colors.muted,
  },

  security: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FAF5',
    borderRadius: 15,
    padding: 12,
    marginBottom: 17,
  },

  securityIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#DDF5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  securityContent: {
    flex: 1,
    marginLeft: 9,
  },

  securityTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#32694F',
    marginBottom: 2,
  },

  securityText: {
    fontSize: 9.5,
    lineHeight: 14,
    color: '#527466',
  },

  submitArea: {
    marginTop: 1,
    marginBottom: 10,
  },

  submitHint: {
    textAlign: 'center',
    fontSize: 8.5,
    lineHeight: 13,
    color: colors.muted,
    marginTop: 8,
    paddingHorizontal: 15,
  },
});