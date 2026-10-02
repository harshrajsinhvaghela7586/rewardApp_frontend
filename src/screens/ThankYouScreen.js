import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react-native';

import Screen from '../components/Screen';
import Button from '../components/Button';

import { colors } from '../theme/theme';

export default function ThankYouScreen({ navigation }) {
  return (
    <Screen contentStyle={styles.content}>

      {/* SUCCESS ICON */}
      <View style={styles.successWrapper}>
        <View style={styles.successOuter}>
          <View style={styles.successIcon}>
            <CheckCircle2
              size={58}
              color={colors.success}
              strokeWidth={2.2}
            />
          </View>
        </View>
      </View>

      {/* TITLE */}
      <Text style={styles.title}>
        Application Submitted!
      </Text>

      <Text style={styles.sub}>
        Your motor insurance details have been
        submitted successfully.
      </Text>

      {/* SUCCESS BADGE */}
      <View style={styles.successBadge}>
        <CheckCircle2
          size={14}
          color={colors.success}
          strokeWidth={2.5}
        />

        <Text style={styles.successBadgeText}>
          Submission completed successfully
        </Text>
      </View>

      {/* VERIFICATION STATUS */}
      <View style={styles.statusCard}>

        <View style={styles.statusIcon}>
          <Clock3
            size={25}
            color={colors.blue}
            strokeWidth={2}
          />
        </View>

        <View style={styles.statusContent}>
          <Text style={styles.statusTitle}>
            Our team will contact you shortly
          </Text>

          <Text style={styles.statusText}>
            Your application and documents have been submitted
            successfully. Our team will verify your details and
            contact you shortly regarding the next steps.
          </Text>
        </View>

      </View>

      {/* REWARD INFO */}
      <View style={styles.reward}>

        <View style={styles.rewardIcon}>
          <ShieldCheck
            size={25}
            color={colors.orange}
            strokeWidth={2}
          />
        </View>

        <View style={styles.rewardContent}>

          <Text style={styles.rewardTitle}>
  Reward status
</Text>

<Text style={styles.rewardSub}>
  Your reward is not available yet. It will be credited
  after your application and policy are successfully
  verified by our team.
</Text>

        </View>

      </View>

      {/* DASHBOARD BUTTON */}
      <Button
        title="Access Your Dashboard"
        onPress={() =>
          navigation.navigate('Home')
        }
      />

      {/* NEXT STEPS */}
      <View style={styles.policyCard}>

        <View style={styles.policyIcon}>
          <LayoutDashboard
            size={20}
            color={colors.blue}
          />
        </View>

        <View style={styles.policyContent}>

          <Text style={styles.policyTitle}>
            What happens next?
          </Text>

          <Text style={styles.policyText}>
            Our team will verify your information and
            documents. Once everything is approved,
            your policy details and eligible reward
            will appear in your Vinsure dashboard.
          </Text>

        </View>

      </View>

      {/* FOOTER NOTE */}
      <Text style={styles.footerText}>
        Thank you for choosing Vinsure.
      </Text>

    </Screen>
  );
}

const styles = StyleSheet.create({

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 35,
    paddingBottom: 35,
  },

  /* ================= SUCCESS ================= */

  successWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },

  successOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EAF8F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#DDF5E8',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 7,

    elevation: 2,
  },

  /* ================= TITLE ================= */

  title: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '900',
    color: colors.navy,
    textAlign: 'center',
  },

  sub: {
    maxWidth: 310,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 9,
    alignSelf: 'center',
  },

  /* ================= BADGE ================= */

  successBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FAF5',
    borderWidth: 1,
    borderColor: '#D7F0E3',
    borderRadius: 30,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginTop: 16,
  },

  successBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#347354',
    marginLeft: 6,
  },

  /* ================= STATUS ================= */

  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: '#F7FAFF',

    borderWidth: 1,
    borderColor: '#E1EAF8',

    borderRadius: 19,

    padding: 15,

    marginTop: 24,
    marginBottom: 13,
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusContent: {
    flex: 1,
    marginLeft: 12,
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.navy,
    marginBottom: 5,
  },

  statusText: {
    fontSize: 10,
    lineHeight: 15,
    color: colors.muted,
  },

  /* ================= REWARD ================= */

  reward: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: '#FFF8ED',

    borderWidth: 1,
    borderColor: '#F9E5C5',

    borderRadius: 19,

    padding: 15,

    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.035,
    shadowRadius: 8,

    elevation: 1,
  },

  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFF0D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  rewardContent: {
    flex: 1,
  },

  rewardTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: colors.text,
  },

  rewardSub: {
    fontSize: 10.5,
    lineHeight: 15,
    color: colors.muted,
    marginTop: 4,
  },

  /* ================= NEXT STEPS ================= */

  policyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: '#F7FAFF',

    borderWidth: 1,
    borderColor: '#E1EAF8',

    borderRadius: 17,

    padding: 13,

    marginTop: 16,
  },

  policyIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  policyContent: {
    flex: 1,
    marginLeft: 10,
  },

  policyTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: colors.navy,
    marginBottom: 4,
  },

  policyText: {
    fontSize: 9.5,
    lineHeight: 14,
    color: colors.muted,
  },

  /* ================= FOOTER ================= */

  footerText: {
    fontSize: 9.5,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 17,
  },
});