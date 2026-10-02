import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Svg, {
  Circle,
  Path,
  Rect,
} from 'react-native-svg';

import { colors } from '../theme/theme';

export default function AnimatedCar() {
  const progress = useRef(
    new Animated.Value(0)
  ).current;

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const animateTo = (value, duration) => {
      return new Promise((resolve) => {
        Animated.timing(progress, {
          toValue: value,
          duration,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished && !cancelled) {
            setPercent(Math.round(value * 100));
          }

          resolve();
        });
      });
    };

    const startAnimation = async () => {
      progress.setValue(0);
      setPercent(0);

      // 0% → 5%
      await animateTo(0.05, 1000);

      // 5% → 48%
      await animateTo(0.48, 1800);

      // 48% → 72%
      await animateTo(0.72, 1300);

      // 72% → 100%
      await animateTo(1, 1800);
    };

    startAnimation();

    return () => {
      cancelled = true;
      progress.stopAnimation();
    };
  }, [progress]);

  /*
   * Car follows the progress bar.
   */
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-88, 88],
  });

  /*
   * Very subtle car movement.
   */
  const translateY = progress.interpolate({
    inputRange: [0, 0.48, 1],
    outputRange: [2, 0, -1],
  });

  const carScale = progress.interpolate({
    inputRange: [0, 0.05, 0.48, 0.72, 1],
    outputRange: [
      0.78,
      0.84,
      0.94,
      0.98,
      1.03,
    ],
  });

  /*
   * Progress bar follows the same Animated.Value.
   */
  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>

      {/* ================= CAR ================= */}

      <Animated.View
        style={[
          styles.car,
          {
            transform: [
              { translateX },
              { translateY },
              { scale: carScale },
            ],
          },
        ]}
      >
        <Svg
          width="82"
          height="48"
          viewBox="0 0 210 105"
        >
          {/* Main car body */}
          <Path
            d="M30 67 L43 40 Q48 29 63 28 L130 28 Q145 29 155 42 L172 56 L190 59 Q198 61 201 68 L201 78 L16 78 Q16 69 30 67Z"
            fill={colors.blue || '#1D65D8'}
          />

          {/* Left window */}
          <Path
            d="M59 31 L72 31 L84 50 L48 50 L52 39 Q54 33 59 31Z"
            fill="#BFD9FF"
          />

          {/* Right window */}
          <Path
            d="M88 31 L126 31 Q138 32 147 50 L92 50Z"
            fill="#BFD9FF"
          />

          {/* Left bumper */}
          <Rect
            x="14"
            y="66"
            width="20"
            height="10"
            rx="4"
            fill="#0E4FAE"
          />

          {/* Right bumper */}
          <Rect
            x="176"
            y="64"
            width="23"
            height="10"
            rx="4"
            fill="#0E4FAE"
          />

          {/* Left wheel */}
          <Circle
            cx="52"
            cy="78"
            r="15"
            fill="#17243D"
          />

          <Circle
            cx="52"
            cy="78"
            r="7"
            fill="#D8E1EE"
          />

          {/* Right wheel */}
          <Circle
            cx="166"
            cy="78"
            r="15"
            fill="#17243D"
          />

          <Circle
            cx="166"
            cy="78"
            r="7"
            fill="#D8E1EE"
          />

          {/* Headlight */}
          <Rect
            x="183"
            y="62"
            width="8"
            height="5"
            rx="2"
            fill="#FFF2A8"
          />

          {/* Front highlight */}
          <Path
            d="M19 62 Q25 54 36 53 L44 53"
            stroke="#79A9F5"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      {/* ================= PERCENTAGE ================= */}

      <View style={styles.percentBox}>
        <Text style={styles.percent}>
          {percent}%
        </Text>
      </View>

      {/* ================= PROGRESS BAR ================= */}

      <View style={styles.progressTrack}>

        <Animated.View
          style={[
            styles.progressFill,
            {
              width: fillWidth,
            },
          ]}
        />

      </View>

      {/* ================= LOADING ================= */}

      <Text style={styles.loadingText}>
        Loading...
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 112,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  /* ================= CAR ================= */

  car: {
    position: 'absolute',

    // Car stays directly above progress bar
    bottom: 43,

    width: 82,
    height: 48,

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 5,
  },

  /* ================= PERCENTAGE ================= */

  percentBox: {
    position: 'absolute',

    bottom: 25,

    minWidth: 42,
    height: 20,

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 6,
  },

  percent: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.navy || '#102A43',
  },

  /* ================= PROGRESS ================= */

  progressTrack: {
    position: 'absolute',

    bottom: 15,

    width: 220,
    height: 6,

    borderRadius: 10,

    backgroundColor: '#DDE7F3',

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',

    borderRadius: 10,

    backgroundColor: colors.blue || '#1D65D8',
  },

  /* ================= LOADING ================= */

  loadingText: {
    position: 'absolute',

    bottom: -1,

    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,

    color: '#8A98AD',
  },
});