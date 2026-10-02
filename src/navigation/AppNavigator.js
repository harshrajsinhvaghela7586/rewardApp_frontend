import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  View,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  clearToken,
  getToken,
  userApi,
} from '../services/api';

import { colors } from '../theme/theme';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthScreen from '../screens/AuthScreen';
import VehicleScreen from '../screens/VehicleScreen';
import PersonalScreen from '../screens/PersonalScreen';
import KycScreen from '../screens/KycScreen';
import NomineeScreen from '../screens/NomineeScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ThankYouScreen from '../screens/ThankYouScreen';
import ScratchScreen from '../screens/ScratchScreen';
import HomeScreen from '../screens/HomeScreen';
import ReferralScreen from '../screens/ReferralScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReferralCodeScreen from '../screens/ReferralCodeScreen';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [boot, setBoot] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Splash');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = await getToken();

      // No token = new user
      if (!token) {
        setInitialRoute('Splash');
        return;
      }

      // Token exists -> ask backend for actual application status
      const response = await userApi.me();

      const nextStep =
        response?.application?.nextStep ||
        'Vehicle';

      const isFirstTime =
        response?.application?.isFirstTime === true;

      if (
        isFirstTime &&
        nextStep === 'Vehicle'
      ) {
        setInitialRoute('ReferralCode');
      } else {
        setInitialRoute(nextStep);
      }
    } catch (error) {
      // Invalid / expired token
      await clearToken();

      setInitialRoute('Splash');
    } finally {
      setTimeout(() => {
        setBoot(false);
      }, 300);
    }
  };

  if (boot) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          color={colors.blue}
          size="large"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />

        <Stack.Screen
          name="Auth"
          component={AuthScreen}
        />

        <Stack.Screen
          name="Vehicle"
          component={VehicleScreen}
        />

        <Stack.Screen
          name="ReferralCode"
          component={ReferralCodeScreen}
        />
        <Stack.Screen
          name="Personal"
          component={PersonalScreen}
        />

        <Stack.Screen
          name="Kyc"
          component={KycScreen}
        />

        <Stack.Screen
          name="Nominee"
          component={NomineeScreen}
        />

        <Stack.Screen
          name="Review"
          component={ReviewScreen}
        />

        <Stack.Screen
          name="ThankYou"
          component={ThankYouScreen}
        />

        <Stack.Screen
          name="Scratch"
          component={ScratchScreen}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Referral"
          component={ReferralScreen}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}