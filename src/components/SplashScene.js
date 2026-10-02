import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { colors } from '../theme/theme';

/* =========================================================
   Chhote helpers
========================================================= */

// Hamesha same "random" numbers (har render par scene same rahe)
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Periodic hill (k = poori width mein kitni lehrein). k integer ho to loop seamless rehta hai.
function hillPath(W, H, base, amp, k, phase) {
  const steps = Math.ceil(W / 6);
  let d = `M0 ${H}`;
  for (let i = 0; i <= steps; i++) {
    const x = (W / steps) * i;
    const y =
      H -
      base -
      amp * (0.5 + 0.5 * Math.sin((2 * Math.PI * k * x) / W + phase));
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} L${W} ${H} Z`;
}

/* =========================================================
   Infinite scrolling layer (parallax)
   Do identical copies side by side, 1 width ke barabar slide hoti hain.
========================================================= */

function ScrollingLayer({
  width,
  height,
  duration,
  bottom,
  top,
  children,
}) {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    x.setValue(0);

    const loop = Animated.loop(
      Animated.timing(x, {
        toValue: -width,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => loop.stop();
  }, [x, width, duration]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        width: width * 2,
        height,
        flexDirection: 'row',
        ...(bottom !== undefined ? { bottom } : { top }),
        transform: [{ translateX: x }],
      }}
    >
      <Svg width={width} height={height}>
        {children}
      </Svg>
      <Svg width={width} height={height}>
        {children}
      </Svg>
    </Animated.View>
  );
}

/* =========================================================
   Scenery pieces
========================================================= */

function Hills({ W, H, base, amp, k, phase, fill }) {
  return <Path d={hillPath(W, H, base, amp, k, phase)} fill={fill} />;
}

function City({ W, H }) {
  const items = useMemo(() => {
    const rng = seeded(7);
    const list = [];
    let x = 6;

    while (true) {
      const w = 24 + Math.floor(rng() * 24);

      if (x + w > W - 6) {
        break;
      }

      const h = 38 + Math.floor(rng() * (H - 50));
      list.push({ x, w, h });
      x += w + 3 + Math.floor(rng() * 8);
    }

    return list;
  }, [W, H]);

  return (
    <>
      {items.map((b, index) => {
        const cols = Math.max(1, Math.floor((b.w - 8) / 9));
        const rows = Math.min(6, Math.floor((b.h - 10) / 12));
        const windows = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            windows.push(
              <Rect
                key={`${index}-${r}-${c}`}
                x={b.x + 5 + c * 9}
                y={H - b.h + 7 + r * 12}
                width={4}
                height={5}
                rx={1}
                fill="#E8F1FC"
              />
            );
          }
        }

        return (
          <React.Fragment key={index}>
            <Rect
              x={b.x}
              y={H - b.h}
              width={b.w}
              height={b.h}
              rx={3}
              fill="#C3D9F2"
            />
            {windows}
          </React.Fragment>
        );
      })}
    </>
  );
}

function Trees({ W, H }) {
  const trees = useMemo(() => {
    const rng = seeded(21);
    const list = [];
    let x = 16;

    while (x < W - 18) {
      list.push({
        x,
        h: 32 + Math.floor(rng() * 26),
        tone: list.length % 2,
      });
      x += 62 + Math.floor(rng() * 50);
    }

    return list;
  }, [W]);

  return (
    <>
      {trees.map((t, index) => (
        <React.Fragment key={index}>
          <Rect
            x={t.x - 2}
            y={H - t.h * 0.5}
            width={4}
            height={t.h * 0.5}
            rx={2}
            fill="#A59382"
          />
          <Circle
            cx={t.x}
            cy={H - t.h * 0.62}
            r={t.h * 0.42}
            fill={t.tone ? '#8FC8A8' : '#A3D6B9'}
          />
          <Circle
            cx={t.x + t.h * 0.2}
            cy={H - t.h * 0.5}
            r={t.h * 0.28}
            fill={t.tone ? '#A3D6B9' : '#8FC8A8'}
          />
        </React.Fragment>
      ))}
    </>
  );
}

function Clouds({ W }) {
  const clouds = [
    { x: 0.06, y: 34, w: 84 },
    { x: 0.44, y: 78, w: 66 },
    { x: 0.7, y: 18, w: 76 },
  ];

  return (
    <>
      {clouds.map((c, index) => {
        const x = c.x * W;
        const h = 18;

        return (
          <React.Fragment key={index}>
            <Rect
              x={x}
              y={c.y}
              width={c.w}
              height={h}
              rx={h / 2}
              fill="rgba(255,255,255,0.92)"
            />
            <Circle
              cx={x + c.w * 0.3}
              cy={c.y + 3}
              r={12}
              fill="rgba(255,255,255,0.92)"
            />
            <Circle
              cx={x + c.w * 0.58}
              cy={c.y - 1}
              r={15}
              fill="rgba(255,255,255,0.92)"
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

function Birds({ W }) {
  const birds = [
    { x: 0.14, y: 22, s: 1 },
    { x: 0.24, y: 44, s: 0.75 },
    { x: 0.6, y: 12, s: 0.9 },
    { x: 0.7, y: 36, s: 0.7 },
  ];

  return (
    <>
      {birds.map((b, index) => {
        const x = b.x * W;
        const k = b.s;

        return (
          <Path
            key={index}
            d={`M${x} ${b.y} q${5 * k} ${-6 * k} ${10 * k} 0 q${5 * k} ${-6 * k} ${10 * k} 0`}
            stroke="#6F8FBF"
            strokeWidth={1.6}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </>
  );
}

function LaneMarks({ W }) {
  const n = Math.max(4, Math.round(W / 90));
  const P = W / n;

  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <Rect
          key={i}
          x={i * P + P * 0.15}
          y={0}
          width={P * 0.5}
          height={4}
          rx={2}
          fill="#E4EDF9"
        />
      ))}
    </>
  );
}

/* =========================================================
   Car (wheels alag se ghoomte hain)
========================================================= */

const CAR_W = 150;
const CAR_H = 75;
const CAR_SCALE = CAR_W / 210;
const WHEEL_SIZE = 30 * CAR_SCALE; // r=15 in 210x105 viewBox

function Wheel({ spin, cx, cy }) {
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: cx * CAR_SCALE - WHEEL_SIZE / 2,
        top: cy * CAR_SCALE - WHEEL_SIZE / 2,
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        transform: [{ rotate }],
      }}
    >
      <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox="0 0 30 30">
        <Circle cx="15" cy="15" r="15" fill="#17243D" />
        <Circle cx="15" cy="15" r="8" fill="#D8E1EE" />
        <Path
          d="M15 7 L15 23 M7 15 L23 15 M9.3 9.3 L20.7 20.7 M20.7 9.3 L9.3 20.7"
          stroke="#9FB0C7"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <Circle cx="15" cy="15" r="2.6" fill="#17243D" />
      </Svg>
    </Animated.View>
  );
}

function Car({ bottom }) {
  const { width } = useWindowDimensions();

  const spin = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 520,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: -1.6,
          duration: 260,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 260,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    spinLoop.start();
    bobLoop.start();

    return () => {
      spinLoop.stop();
      bobLoop.stop();
    };
  }, [spin, bob]);

  return (
    <>
      {/* road par parchhai */}
      <View
        pointerEvents="none"
        style={[
          styles.carShadow,
          {
            bottom: bottom + 3,
            left: width / 2 - 60,
          },
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom,
          left: width / 2 - CAR_W / 2,
          width: CAR_W,
          height: CAR_H,
          transform: [{ translateY: bob }],
        }}
      >
        <Svg width={CAR_W} height={CAR_H} viewBox="0 0 210 105">
          {/* body */}
          <Path
            d="M30 67 L43 40 Q48 29 63 28 L130 28 Q145 29 155 42 L172 56 L190 59 Q198 61 201 68 L201 78 L16 78 Q16 69 30 67Z"
            fill={colors.blue}
          />

          {/* windows */}
          <Path
            d="M59 31 L72 31 L84 50 L48 50 L52 39 Q54 33 59 31Z"
            fill="#BFD9FF"
          />
          <Path
            d="M88 31 L126 31 Q138 32 147 50 L92 50Z"
            fill="#BFD9FF"
          />

          {/* bumpers */}
          <Rect x="14" y="66" width="20" height="10" rx="4" fill="#0E4FAE" />
          <Rect x="176" y="64" width="23" height="10" rx="4" fill="#0E4FAE" />

          {/* wheel arches */}
          <Circle cx="52" cy="78" r="18" fill="#0E4FAE" />
          <Circle cx="166" cy="78" r="18" fill="#0E4FAE" />

          {/* headlight + highlight */}
          <Rect x="183" y="62" width="8" height="5" rx="2" fill="#FFF2A8" />
          <Path
            d="M19 62 Q25 54 36 53 L44 53"
            stroke="#79A9F5"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>

        <Wheel spin={spin} cx={52} cy={78} />
        <Wheel spin={spin} cx={166} cy={78} />
      </Animated.View>
    </>
  );
}

/* =========================================================
   FULL-SCREEN SCENE
========================================================= */

export default function SplashScene({ roadHeight = 190 }) {
  const { width: W, height: H } = useWindowDimensions();

  // Car ke pahiye road ki surface par (road top se 36px neeche)
  const wheelBottomOffset = (105 - 78 - 15) * CAR_SCALE;
  const carBottom = roadHeight - 36 - wheelBottomOffset;

  const baseY = roadHeight + 8; // scenery ka base (grass strip ke upar)

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* ================= SKY ================= */}
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#B4D6FF" />
            <Stop offset="0.5" stopColor="#D6E8FF" />
            <Stop offset="1" stopColor="#F0F7FF" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width={W} height={H} fill="url(#sky)" />

        {/* sun */}
        <Circle cx={W * 0.84} cy={H * 0.09} r={46} fill="rgba(255,255,255,0.28)" />
        <Circle cx={W * 0.84} cy={H * 0.09} r={30} fill="rgba(255,244,196,0.95)" />
      </Svg>

      {/* ================= CLOUDS ================= */}
      <ScrollingLayer
        width={W}
        height={120}
        duration={110000}
        top={H * 0.04}
      >
        <Clouds W={W} />
      </ScrollingLayer>

      <ScrollingLayer
        width={W}
        height={120}
        duration={75000}
        top={H * 0.4}
      >
        <Clouds W={W} />
      </ScrollingLayer>

      {/* ================= BIRDS ================= */}
      <ScrollingLayer
        width={W}
        height={80}
        duration={42000}
        top={H * 0.27}
      >
        <Birds W={W} />
      </ScrollingLayer>

      {/* ================= FAR HILLS ================= */}
      <ScrollingLayer
        width={W}
        height={260}
        duration={90000}
        bottom={baseY}
      >
        <Hills W={W} H={260} base={110} amp={70} k={1} phase={0.6} fill="#CFE3F8" />
      </ScrollingLayer>

      {/* ================= CITY ================= */}
      <ScrollingLayer
        width={W}
        height={190}
        duration={55000}
        bottom={baseY}
      >
        <City W={W} H={190} />
      </ScrollingLayer>

      {/* ================= NEAR HILLS ================= */}
      <ScrollingLayer
        width={W}
        height={120}
        duration={34000}
        bottom={baseY}
      >
        <Hills W={W} H={120} base={36} amp={40} k={2} phase={1.4} fill="#BBD8F2" />
      </ScrollingLayer>

      {/* ================= TREES ================= */}
      <ScrollingLayer
        width={W}
        height={84}
        duration={20000}
        bottom={baseY - 4}
      >
        <Trees W={W} H={84} />
      </ScrollingLayer>

      {/* ================= GRASS + ROAD ================= */}
      <View style={[styles.grass, { bottom: roadHeight }]} />

      <View style={[styles.road, { height: roadHeight }]}>
        <View style={styles.kerb} />
      </View>

      {/* lane markings (fast) */}
      <ScrollingLayer
        width={W}
        height={4}
        duration={900}
        bottom={Math.round(roadHeight * 0.42)}
      >
        <LaneMarks W={W} />
      </ScrollingLayer>

      {/* ================= CAR ================= */}
      <Car bottom={carBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  grass: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#B9DEC6',
  },

  road: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#22335C',
  },

  kerb: {
    height: 6,
    backgroundColor: '#C9DAF1',
  },

  carShadow: {
    position: 'absolute',
    width: 120,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'rgba(10,20,45,0.28)',
  },
});
