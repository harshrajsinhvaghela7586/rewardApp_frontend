# Visezy Insurance Mobile App

React Native + Expo mobile frontend for the supplied Visezy/rewardapp backend.

## Implemented flow

Splash (animated car) → Welcome → Mobile + OTP → RC upload with preview → Current Insurance upload with preview → Personal Details + validation → KYC (Aadhaar/PAN) → Nominee → Review → Thank You → Scratch Card → Cashback → Home/Dashboard → Refer & Earn.

The app persists the JWT token in AsyncStorage. If a token already exists when the app boots, it opens Home directly.

## 1. Setup

```bash
npm install
```

Create `.env` from `.env.example`.

For a Render backend:

```env
EXPO_PUBLIC_API_URL=https://YOUR-BACKEND.onrender.com/api
```

For an Android emulator:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
```

For a physical phone, use the computer's LAN IP, e.g. `http://192.168.1.10:5000/api`.

## 2. Start

```bash
npx expo start
```

Scan the QR with Expo Go or use the Android/iOS commands.

## 3. OTP

The supplied backend uses its configured OTP provider. In development, the backend response also includes the OTP, so the app shows it in an alert. Production should use the real SMS/WhatsApp provider and remove dev OTP exposure.

## 4. Cashback

The supplied backend keeps the cashback amount under admin control. The admin issues a scratch card, for example:

```http
POST /api/admin/users/:userId/scratch-card
Content-Type: application/json
Authorization: Bearer <admin-token>

{ "amount": 250, "currency": "INR" }
```

The mobile app then reads `/api/policy/my-scratch-card` and reveals the amount through `/api/policy/scratch`.

Do not hardcode the final cashback amount in the production mobile app.

## 5. Referral

The supplied backend did not contain referral endpoints/model. The UI displays the requested ₹100 referral rule, but actual referral eligibility and reward crediting must be implemented server-side before production.

## 6. Backend changes included

The `backend-patched` folder in the delivery zip extends the supplied backend just enough for the requested mobile flow:

- accepts the user's name and vehicle details
- stores nominee details
- accepts Aadhaar/PAN uploads
- accepts JPG/PNG/WEBP in addition to PDF/Word for user document uploads
- keeps the existing policy/scratch-card APIs intact

