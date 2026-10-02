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
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../theme/theme';
import AnimatedCar from '../components/AnimatedCar';
import { bannerApi } from '../services/api';

export default function SplashScreen({
  navigation,
}) {
  const progress =
    useRef(new Animated.Value(0)).current;

  const logoOpacity =
    useRef(new Animated.Value(0)).current;

  const logoScale =
    useRef(new Animated.Value(0.88)).current;

  const taglineOpacity =
    useRef(new Animated.Value(0)).current;

  const roadOpacity =
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
        roadOpacity,
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
    roadOpacity,
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

      {/* ================= BRAND ================= */}

      <Animated.View
        style={[
          styles.brand,
          {
            opacity:
              logoOpacity,

            transform: [
              {
                scale:
                  logoScale,
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

          <Text
            style={
              styles.brandName
            }
          >
            Vinsure
          </Text>
        </View>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity:
                taglineOpacity,
            },
          ]}
        >
          Drive Forward{'\n'}
          With Confidence
        </Animated.Text>
      </Animated.View>

      {/* ================= ROAD SCENE ================= */}

      <Animated.View
        style={[
          styles.scene,
          {
            opacity:
              roadOpacity,
          },
        ]}
      >
        {/* sky glow */}
        <View
          style={
            styles.skyGlow
          }
        />

        {/* small clouds */}
        <View
          style={[
            styles.cloud,
            styles.cloudOne,
          ]}
        />

        <View
          style={[
            styles.cloud,
            styles.cloudTwo,
          ]}
        />

        {/* distant hills */}
        <View
          style={
            styles.hillBack
          }
        />

        <View
          style={
            styles.hillFront
          }
        />

        {/* road */}
        <View
          style={styles.road}
        />

        {/* road markings */}
        <View
          style={
            styles.roadMarks
          }
        >
          <View
            style={
              styles.roadMark
            }
          />

          <View
            style={
              styles.roadMark
            }
          />

          <View
            style={
              styles.roadMark
            }
          />

          <View
            style={
              styles.roadMark
            }
          />
        </View>

        {/* OUR CAR */}
        <AnimatedCar />
      </Animated.View>

      {/* ================= LOADING ================= */}

      <View
        style={
          styles.loadingArea
        }
      >
        {!loadingError ? (
          <>
            <View
              style={
                styles.loaderRow
              }
            >
              <ActivityIndicator
                size="small"
                color={
                  colors.blue
                }
              />

              <Text
                style={
                  styles.loadingText
                }
              >
                {loadingText}
              </Text>
            </View>

            <View
              style={
                styles.progressTrack
              }
            >
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width:
                      progressWidth,
                  },
                ]}
              />
            </View>
          </>
        ) : (
          <>
            <Text
              style={
                styles.errorText
              }
            >
              {loadingText}
            </Text>

            <Animated.View
              style={
                styles.retryButton
              }
            >
              <Text
                style={
                  styles.retryText
                }
                onPress={
                  handleRetry
                }
              >
                Try Again
              </Text>
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      '#FFFFFF',
    alignItems: 'center',
    justifyContent:
      'center',
    overflow: 'hidden',
  },

  /* ================= BRAND ================= */

  brand: {
    alignItems:
      'center',
    marginBottom: 25,
  },

  header: {
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'center',
    marginBottom: 14,
  },

  logo: {
    width: 105,
    height: 38,
    marginLeft:-40
  },

  brandName: {
    marginLeft: -28,
    fontSize: 24,
    fontWeight: '900',
    color:
      colors.navy,
    letterSpacing:
      -0.5,
  },

  tagline: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color:
      '#64748B',
    textAlign:
      'center',
    fontWeight: '600',
  },

  /* ================= SCENE ================= */

  scene: {
    width: '100%',
    height: 180,
    position:
      'relative',
    overflow:
      'hidden',
    backgroundColor:
      '#F2F7FD',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor:
      '#E2EBF7',
    alignItems:
      'center',
    justifyContent:
      'flex-end',
  },

  skyGlow: {
    position:
      'absolute',
    width: 230,
    height: 110,
    borderRadius: 100,
    backgroundColor:
      '#E7F1FF',
    top: 10,
    alignSelf:
      'center',
  },

  cloud: {
    position:
      'absolute',
    height: 18,
    borderRadius: 20,
    backgroundColor:
      'rgba(255,255,255,0.85)',
  },

  cloudOne: {
    width: 65,
    top: 38,
    left: 8,
  },

  cloudTwo: {
    width: 45,
    top: 65,
    right: 14,
  },

  hillBack: {
    position:
      'absolute',
    width: 260,
    height: 95,
    borderRadius: 130,
    backgroundColor:
      '#DDECFB',
    bottom: 38,
    left: -85,
  },

  hillFront: {
    position:
      'absolute',
    width: 300,
    height: 80,
    borderRadius: 150,
    backgroundColor:
      '#D4E7F9',
    bottom: 28,
    right: -100,
  },

  road: {
    position:
      'absolute',
    width: '120%',
    height: 52,
    bottom: 0,
    backgroundColor:
      '#E7EEF7',
  },

  roadMarks: {
    position:
      'absolute',
    bottom: 22,
    width: '100%',
    flexDirection:
      'row',
    justifyContent:
      'space-around',
    paddingHorizontal: 8,
  },

  roadMark: {
    width: 34,
    height: 2,
    borderRadius: 2,
    backgroundColor:
      '#B9C9DC',
  },

  /* ================= LOADING ================= */

  loadingArea: {
    alignItems:
      'center',
    marginTop: 18,
    minHeight: 42,
    justifyContent:
      'center',
  },

  loaderRow: {
    flexDirection:
      'row',
    alignItems:
      'center',
    justifyContent:
      'center',
  },

  progressTrack: {
    width: 145,
    height: 4,
    borderRadius: 10,
    backgroundColor:
      '#E1E8F1',
    overflow:
      'hidden',
    marginTop: 9,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor:
      colors.blue,
  },

  loadingText: {
    marginLeft: 8,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    color:
      '#8A98AD',
  },

  errorText: {
    fontSize: 10,
    fontWeight: '700',
    color:
      '#8A98AD',
    textAlign:
      'center',
  },

  retryButton: {
    marginTop: 7,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor:
      '#EEF5FF',
  },

  retryText: {
    fontSize: 10,
    fontWeight: '800',
    color:
      colors.blue,
  },
});