import AsyncStorage from '@react-native-async-storage/async-storage';
import { File } from 'expo-file-system';

const RAW_URL = process.env.EXPO_PUBLIC_API_URL || '';
const BASE_URL = RAW_URL.replace(/\/$/, '');

export async function api(path, options = {}) {
  const token = await AsyncStorage.getItem('authToken');

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
  ...options,
  headers: {
    ...headers,
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
  cache: 'no-store',
});
  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    const error = new Error(
      data.message || 'Something went wrong'
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export const authApi = {
  sendOtp: (phone, via = 'sms') =>
    api('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({
        phone,
        via,
      }),
    }),

  resendOtp: (phone, via = 'sms') =>
    api('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({
        phone,
        via,
      }),
    }),

  verifyOtp: (phone, otp) =>
    api('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        phone,
        otp,
      }),
    }),
};
export async function saveToken(token) {
  await AsyncStorage.setItem('authToken', token);
}

export const bannerApi = {
  list: () => api('/banners'),
};

export async function clearToken() {
  await AsyncStorage.removeItem('authToken');
}

export async function getToken() {
  return AsyncStorage.getItem('authToken');
}

export const userApi = {
  me: () => api('/user/me'),

  updateProfile: (payload) =>
    api('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
    
    referral: (referralCode) =>
  api('/user/apply-referral', {
    method: 'POST',
    body: JSON.stringify({
      referralCode,
    }),
  }),

skipReferral: () =>
  api('/user/skip-referral', {
    method: 'POST',
  }),
  
  submitProfile: async (payload, files = {}) => {
    const form = new FormData();

    // Normal fields
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, String(value));
      }
    });

    // Image/document files
    Object.entries(files).forEach(([field, file]) => {
      if (!file?.uri) return;

      const expoFile = new File(file.uri);

      form.append(field, expoFile);
    });

    return api('/user/profile', {
      method: 'POST',
      body: form,
    });
  },
};

export const policyApi = {
  myPolicy: () => api('/policy/my-policy'),

  myScratchCard: () =>
    api('/policy/my-scratch-card'),

  scratch: () =>
    api('/policy/scratch', {
      method: 'POST',
    }),

  history: () =>
    api('/policy/scratch-history'),
};