import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/theme';
import SplashScene from '../components/SplashScene';
import { bannerApi } from '../services/api';

// Road (neeche wala dark hissa) ki height; loading UI isi par aata hai
const ROAD_HEIGHT = 190;

export default function SplashScreen({
  navigation,
}) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const progress =
    useRef(new Animated.Value(0)).current;

  const logoOpacity =
    useRef(new Animated.Value(0)).current;

  const logoScale =
    useRef(new Animated.Value(0.88)).current;

  const taglineOpacity =
    useRef(new Animated.Value(0)).current;

  const loadingOpacity =
    useRef(new Animated.Value(0)).current;

  const [loadingText, setLoadingText] =
    useState('Preparing your experience...');

  const [loadingError, setLoadingError] =
    useState(false);

  /* =========================================
     PRELOAD BANNER DATA + IMAGES
  ========================================= */

  const preloadBanners = async () => {
    setLoadingError(false);

    try {
      setLoadingText(
        'Loading Vinsure experience...'
      );

      const response =
        await bannerApi.list();

      const banners =
        response?.banners;

      /*
       * API response proper hona chahiye.
       */
      if (!Array.isArray(banners)) {
        throw new Error(
          'Invalid banner response.'
        );
      }

      setLoadingText(
        'Preparing your banners...'
      );

      /*
       * Banner image URLs collect karo.
       */
      const imageUrls = banners
        .map(
          (banner) =>
            banner?.imageUrl ||
            banner?.image ||
            banner?.image?.url ||
            banner?.bannerImage
        )
        .filter(
          (url) =>
            typeof url === 'string' &&
            url.trim().length > 0
        );

      /*
       * Images ko pehle preload/cache karo.
       *
       * Agar banners hain to sab images
       * successfully preload honi chahiye.
       */
      if (imageUrls.length > 0) {
        setLoadingText(
          'Loading banner images...'
        );

        const results =
          await Promise.all(
            imageUrls.map((url) =>
              Image.prefetch(url)
            )
          );

        const failed =
          results.some(
            (result) => result === false
          );

        if (failed) {
          throw new Error(
            'Some banner images failed to load.'
          );
        }
      }

      setLoadingText(
        'Everything is ready...'
      );

      return true;
    } catch (error) {
      console.log(
        'Splash preload error:',
        error?.message
      );

      setLoadingError(true);

      setLoadingText(
        'Unable to load. Please try again.'
      );

      return false;
    }
  };

  /* =========================================
     INTRO ANIMATION
  ========================================= */

  const runIntroAnimation = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(
          logoOpacity,
          {
            toValue: 1,
            duration: 500,
            easing: Easing.out(
              Easing.ease
            ),
            useNativeDriver: true,
          }
        ),

        Animated.spring(
          logoScale,
          {
            toValue: 1,
            friction: 7,
            tension: 55,
            useNativeDriver: true,
          }
        ),
      ]),

      Animated.timing(
        taglineOpacity,
        {
          toValue: 1,
          duration: 400,
          easing: Easing.out(
            Easing.ease
          ),
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        loadingOpacity,
        {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }
      ),
    ]).start();
  };

  /* =========================================
     PROGRESS
  ========================================= */

  const startProgress = () => {
    Animated.timing(
      progress,
      {
        toValue: 0.85,
        duration: 1800,
        easing: Easing.out(
          Easing.cubic
        ),
        useNativeDriver: false,
      }
    ).start();
  };

  const finishProgress = () => {
    return new Promise((resolve) => {
      Animated.timing(
        progress,
        {
          toValue: 1,
          duration: 450,
          easing: Easing.out(
            Easing.cubic
          ),
          useNativeDriver: false,
        }
      ).start(() => {
        resolve();
      });
    });
  };

  /* =========================================
     INITIALIZATION
  ========================================= */

  useEffect(() => {
    let mounted = true;

    runIntroAnimation();

    startProgress();

    const initialize = async () => {
      /*
       * Minimum splash duration.
       *
       * Isse agar API bahut fast bhi ho,
       * splash instantly disappear nahi hoga.
       */
      const minimumSplashTime =
        new Promise((resolve) =>
          setTimeout(
            resolve,
            2300
          )
        );

      const bannerReady =
        preloadBanners();

      const [
        isReady,
      ] = await Promise.all([
        bannerReady,
        minimumSplashTime,
      ]);

      if (!mounted) {
        return;
      }

      /*
       * Agar banners/images load nahi hue,
       * Splash par hi raho.
       */
      if (!isReady) {
        return;
      }

      await finishProgress();

      if (!mounted) {
        return;
      }

      /*
       * Small pause after 100%.
       * Transition thoda polished feel hoga.
       */
      setTimeout(() => {
        if (!mounted) {
          return;
        }

        navigation.replace(
          'Welcome'
        );
      }, 250);
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [
    navigation,
    progress,
    logoOpacity,
    logoScale,
    taglineOpacity,
    loadingOpacity,
  ]);

  /* =========================================
     RETRY
  ========================================= */

  const handleRetry = async () => {
    const success =
      await preloadBanners();

    if (!success) {
      return;
    }

    await finishProgress();

    setTimeout(() => {
      navigation.replace(
        'Welcome'
      );
    }, 250);
  };

  /* =========================================
     PROGRESS WIDTH
  ========================================= */

  const progressWidth =
    progress.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0%',
        '100%',
      ],
    });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* ============ FULL-SCREEN SCENERY + DRIVING CAR ============ */}

      <SplashScene roadHeight={ROAD_HEIGHT} />

      {/* ================= BRAND ================= */}

      <Animated.View
        style={[
          styles.brand,
          {
            top: insets.top + height * 0.13,
            opacity: logoOpacity,
            transform: [
              {
                scale: logoScale,
              },
            ],
          },
        ]}
      >
        <View style={styles.header}>
          <Image
            source={require(
              '../../assets/visezy-logo.png'
            )}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.brandName}>
            Vinsure
          </Text>
        </View>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
            },
          ]}
        >
          Drive Forward{'\n'}
          With Confidence
        </Animated.Text>
      </Animated.View>

      {/* ================= LOADING (road ke upar) ================= */}

      <Animated.View
        style={[
          styles.loadingArea,
          {
            bottom: insets.bottom + 22,
            opacity: loadingOpacity,
          },
        ]}
      >
        {!loadingError ? (
          <>
            <View style={styles.loaderRow}>
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

              <Text style={styles.loadingText}>
                {loadingText}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth,
                  },
                ]}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.errorText}>
              {loadingText}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.retryPressed,
              ]}
              onPress={handleRetry}
            >
              <Text style={styles.retryText}>
                Try Again
              </Text>
            </Pressable>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E8FF',
    overflow: 'hidden',
  },

  /* ================= BRAND ================= */

  brand: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  logo: {
    width: 105,
    height: 38,
    marginLeft: -40,
  },

  brandName: {
    marginLeft: -28,
    fontSize: 24,
    fontWeight: '900',
    color: colors.navy,
    letterSpacing: -0.5,
  },

  tagline: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: '#4A5E80',
    textAlign: 'center',
    fontWeight: '600',
  },

  /* ================= LOADING ================= */

  loadingArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },

  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressTrack: {
    width: 170,
    height: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
    marginTop: 10,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  loadingText: {
    marginLeft: 8,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#D5E3FA',
  },

  errorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E4EDFB',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  retryPressed: {
    opacity: 0.8,
  },

  retryText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.blue,
  },
});