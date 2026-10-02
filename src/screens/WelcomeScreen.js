import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { bannerApi } from '../services/api';

import {
  Headphones,
  ShieldCheck,
} from 'lucide-react-native';

import Screen from '../components/Screen';
import Button from '../components/Button';

import { colors } from '../theme/theme';

const { width: SCREEN_WIDTH } =
  Dimensions.get('window');

const BANNER_WIDTH =
  SCREEN_WIDTH - 43;

const BANNER_GAP = 14;

const BANNER_ITEM_WIDTH =
  BANNER_WIDTH + BANNER_GAP;

const AUTO_SLIDE_INTERVAL = 7000;

export default function WelcomeScreen({
  navigation,
}) {
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] =
    useState(true);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const sliderRef = useRef(null);
  const autoSlideRef = useRef(null);

  const contentOpacity =
    useRef(
      new Animated.Value(1)
    ).current;

  /* =========================================
     LOAD BANNERS
  ========================================= */

  useEffect(() => {
    loadBanners();

    return () => {
      if (autoSlideRef.current) {
        clearTimeout(
          autoSlideRef.current
        );
      }
    };
  }, []);

  const loadBanners = async () => {
    try {
      setLoadingBanners(true);

      const response =
        await bannerApi.list();

      const activeBanners =
        response?.banners || [];

      setBanners(activeBanners);
      setActiveIndex(0);
    } catch (error) {
      console.log(
        'Banner loading error:',
        error?.message
      );
    } finally {
      setLoadingBanners(false);
    }
  };

  /* =========================================
     AUTO SLIDE
     
     IMPORTANT:
     activeIndex yaha immediately change
     nahi hoga.

     Pehle image slide hogi.
     Momentum complete hone ke baad
     activeIndex update hoga.
  ========================================= */

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    autoSlideRef.current =
      setTimeout(() => {
        const next =
          activeIndex + 1 >= banners.length
            ? 0
            : activeIndex + 1;

       sliderRef.current?.scrollToOffset({
  offset:
    next * BANNER_ITEM_WIDTH,
  animated: true,
});      }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (autoSlideRef.current) {
        clearTimeout(
          autoSlideRef.current
        );
      }
    };
  }, [
    activeIndex,
    banners.length,
  ]);

  /* =========================================
     SLIDER FINISHED
  ========================================= */

  const handleMomentumScrollEnd = (
    event
  ) => {
    const offsetX =
      event.nativeEvent.contentOffset.x;

   const index = Math.round(
  offsetX / BANNER_ITEM_WIDTH
);
    if (
      index >= 0 &&
      index < banners.length
    ) {
      setActiveIndex(index);
    }
  };

  /* =========================================
     CONTENT TRANSITION

     Image change hone ke baad:
     title
     subtitle
     CTA

     smoothly fade honge.
  ========================================= */

  useEffect(() => {
    if (!banners.length) {
      return;
    }

    contentOpacity.setValue(0);

    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [
    activeIndex,
    banners.length,
    contentOpacity,
  ]);

  /* =========================================
     BANNER IMAGE
  ========================================= */

  const getBannerImage = (banner) => {
    return (
      banner?.imageUrl ||
      banner?.image ||
      banner?.image?.url ||
      banner?.bannerImage ||
      ''
    );
  };

  /* =========================================
     ACTIVE BANNER
  ========================================= */

  const activeBanner =
    banners[activeIndex];

  return (
    <Screen
      scroll={false}
      contentStyle={styles.content}
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <View style={styles.header}>
        <Image
          source={require('../../assets/visezy-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brandName}>
          Vinsure
        </Text>
      </View>

      {/* =====================================
          TITLE + SUBTITLE
      ===================================== */}

      {!loadingBanners &&
        banners.length > 0 && (
          <Animated.View
            style={[
              styles.bannerContent,
              {
                opacity:
                  contentOpacity,
              },
            ]}
          >
            {activeBanner?.title && (
              <Text
                style={styles.bannerTitle}
                numberOfLines={2}
              >
                {activeBanner.title}
              </Text>
            )}

            {activeBanner?.subtitle && (
              <Text
                style={styles.bannerSubtitle}
                numberOfLines={2}
              >
                {activeBanner.subtitle}
              </Text>
            )}
          </Animated.View>
        )}

      {/* =====================================
          BANNER SLIDER
      ===================================== */}

      <View style={styles.sliderArea}>
        {loadingBanners ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="large"
              color={colors.blue}
            />
          </View>
        ) : banners.length > 0 ? (
          <>
            <BannerList
              banners={banners}
              sliderRef={sliderRef}
              handleMomentumScrollEnd={
                handleMomentumScrollEnd
              }
              getBannerImage={
                getBannerImage
              }
            />

            {banners.length > 1 && (
              <View style={styles.dots}>
                {banners.map(
                  (banner, index) => (
                    <View
                      key={
                        banner?._id ||
                        banner?.id ||
                        index
                      }
                      style={[
                        styles.dot,
                        index ===
                          activeIndex &&
                          styles.dotActive,
                      ]}
                    />
                  )
                )}
              </View>
            )}
          </>
        ) : (
          <FallbackBanner />
        )}
      </View>

      {/* =====================================
          BENEFITS
      ===================================== */}

      <View style={styles.points}>
        <Point
          icon={
            <ShieldCheck
              size={19}
              color={colors.blue}
              strokeWidth={2.2}
            />
          }
          text="Submit your details securely"
        />

        <Point
          icon={
            <Headphones
              size={19}
              color={colors.blue}
              strokeWidth={2.2}
            />
          }
          text="Get expert support"
        />

        <Point
          icon={
            <ShieldCheck
              size={19}
              color={colors.blue}
              strokeWidth={2.2}
            />
          }
          text="Unlock exciting rewards"
        />
      </View>

      {/* =====================================
          BOTTOM CTA
      ===================================== */}

      <Animated.View
        style={[
          styles.bottom,
          {
            opacity:
              contentOpacity,
          },
        ]}
      >
        <Button
          title={
            activeBanner?.ctaText ||
            'Get Started'
          }
          onPress={() =>
            navigation.navigate('Auth')
          }
        />
      </Animated.View>
    </Screen>
  );
}

/* =================================================
   BANNER LIST
================================================= */
function BannerList({
  banners,
  sliderRef,
  handleMomentumScrollEnd,
  getBannerImage,
}) {
  return (
    <FlatList
      ref={sliderRef}
      data={banners}
      keyExtractor={(item, index) =>
        String(
          item?._id ||
            item?.id ||
            index
        )
      }

      horizontal

      pagingEnabled={false}

      snapToInterval={
        BANNER_ITEM_WIDTH
      }

      snapToAlignment="start"

      decelerationRate="fast"

      showsHorizontalScrollIndicator={false}

      disableIntervalMomentum={false}

      onMomentumScrollEnd={
        handleMomentumScrollEnd
      }

      scrollEventThrottle={16}

      contentContainerStyle={
        styles.bannerListContent
      }

      renderItem={({ item }) => {
        const imageUrl =
          getBannerImage(item);

        return (
          <View
            style={styles.bannerItem}
          >
            <View
              style={styles.bannerCard}
            >
              {imageUrl ? (
                <Image
                  source={{
                    uri: imageUrl,
                  }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={
                    styles.bannerPlaceholder
                  }
                >
                  <ShieldCheck
                    size={45}
                    color={colors.blue}
                  />
                </View>
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

/* =================================================
   FALLBACK
================================================= */

function FallbackBanner() {
  return (
    <View style={styles.fallbackBanner}>
      <View
        style={styles.fallbackGlow}
      />

      <Text style={styles.fallbackKicker}>
        VINSURE
      </Text>

      <Text style={styles.fallbackTitle}>
        Your Motor Insurance,
        {'\n'}
        Made Simple
      </Text>

      <Text style={styles.fallbackText}>
        Quick. Secure. Rewarding.
      </Text>
    </View>
  );
}

/* =================================================
   POINT
================================================= */

function Point({ icon, text }) {
  return (
    <View style={styles.point}>
      <View style={styles.iconBox}>
        {icon}
      </View>

      <Text style={styles.pointText}>
        {text}
      </Text>
    </View>
  );
}

/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 18,
    paddingBottom: 18,
  },

  /* ================= HEADER ================= */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  logo: {
    width: 105,
    height: 38,
  },

  brandName: {
    marginLeft: -28,
    fontSize: 24,
    fontWeight: '900',
    color: colors.navy,
    letterSpacing: -0.5,
  },

  /* ================= BANNER CONTENT ================= */

  bannerContent: {
    alignItems: 'center',
    paddingHorizontal: 18,

    /* title slightly lower */
    marginTop: 14,
    marginBottom: 14,
  },

  bannerTitle: {
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
    color: colors.navy,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  bannerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },

  /* ================= SLIDER ================= */

  sliderArea: {
    minHeight: 235,
    marginTop: 2,
  },

  loadingCard: {
    height: 235,
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#EDF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bannerListContent: {
  paddingRight: 18,
},

bannerItem: {
  width: BANNER_ITEM_WIDTH,
},

bannerCard: {
  width: BANNER_WIDTH,
  height: 235,
  borderRadius: 24,
  overflow: 'hidden',
  backgroundColor: '#EDF4FF',
},

  bannerImage: {
    width: '100%',
    height: '100%',
  },

  bannerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF4FF',
  },

  /* ================= DOTS ================= */

  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 5,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C7D5E7',
  },

  dotActive: {
    width: 20,
    backgroundColor: colors.blue,
  },

  /* ================= FALLBACK ================= */

  fallbackBanner: {
    height: 205,
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#EDF4FF',
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'center',
  },

  fallbackGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -45,
    top: -45,
    backgroundColor: '#DCEAFF',
  },

  fallbackKicker: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.blue,
  },

  fallbackTitle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    color: colors.navy,
    marginTop: 7,
  },

  fallbackText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 8,
  },

  /* ================= POINTS ================= */

  points: {
    marginTop: 8,
    paddingVertical: 8,
  },

  point: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pointText: {
    marginLeft: 10,
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },

  /* ================= BOTTOM ================= */

  bottom: {
    marginTop: 'auto',
    paddingTop: 6,
  },
});