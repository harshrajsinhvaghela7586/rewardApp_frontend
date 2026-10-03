import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Mask,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { colors } from '../theme/theme';

const CARD_HEIGHT = 185;

// Ungli/brush ka size
const BRUSH = 46;

// Kitna hissa scratch hone par poora reveal ho jaye
const REVEAL_THRESHOLD = 0.45;

// Coverage calculate karne ke liye grid cell size
const CELL = 12;

/*
 * Google Pay jaisa scratch card.
 *
 * - Foil ke upar ungli ghumao, foil hat-ti jaati hai.
 * - ~45% scratch hone par poora card reveal ho jata hai
 *   aur onReveal() call hota hai (yaha API call karo).
 * - revealed=true ho to card pehle se khula dikhta hai.
 */
export default function ScratchCard({
  amount = 0,
  revealed = false,
  onReveal,
}) {
  const { width: screenWidth } =
    useWindowDimensions();

  // Screen ke padding (22 * 2) hata ke width
  const width = Math.min(
    screenWidth - 44,
    340
  );
  const height = CARD_HEIGHT;

  const [path, setPath] = useState('');

  const foilOpacity = useRef(
    new Animated.Value(revealed ? 0 : 1)
  ).current;

  const doneRef = useRef(revealed);
  const pathRef = useRef('');
  const lastPoint = useRef(null);
  const startPoint = useRef({ x: 0, y: 0 });
  const revealedCount = useRef(0);
  const cellsRef = useRef(null);
  const geo = useRef({});
  const onRevealRef = useRef(onReveal);

  const cols = Math.ceil(width / CELL);
  const rows = Math.ceil(height / CELL);

  geo.current = { cols, rows };
  onRevealRef.current = onReveal;

  if (
    !cellsRef.current ||
    cellsRef.current.length !== cols * rows
  ) {
    cellsRef.current = new Uint8Array(
      cols * rows
    );
  }

  /* Parent se revealed=true aaye (jaise reload) */
  useEffect(() => {
    if (revealed && !doneRef.current) {
      doneRef.current = true;
      foilOpacity.setValue(0);
    }
  }, [revealed, foilOpacity]);

  const markCells = (x, y) => {
    const { cols: c, rows: r } = geo.current;
    const radius = BRUSH / 2;

    const c0 = Math.max(
      0,
      Math.floor((x - radius) / CELL)
    );
    const c1 = Math.min(
      c - 1,
      Math.floor((x + radius) / CELL)
    );
    const r0 = Math.max(
      0,
      Math.floor((y - radius) / CELL)
    );
    const r1 = Math.min(
      r - 1,
      Math.floor((y + radius) / CELL)
    );

    for (let cy = r0; cy <= r1; cy++) {
      for (let cx = c0; cx <= c1; cx++) {
        const index = cy * c + cx;

        if (cellsRef.current[index]) continue;

        const centerX = (cx + 0.5) * CELL;
        const centerY = (cy + 0.5) * CELL;

        if (
          Math.hypot(
            centerX - x,
            centerY - y
          ) <= radius
        ) {
          cellsRef.current[index] = 1;
          revealedCount.current += 1;
        }
      }
    }
  };

  const finish = () => {
    if (doneRef.current) return;

    doneRef.current = true;

    Animated.timing(foilOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();

    onRevealRef.current?.();
  };

  const checkProgress = () => {
    const { cols: c, rows: r } = geo.current;

    if (
      revealedCount.current / (c * r) >=
      REVEAL_THRESHOLD
    ) {
      finish();
    }
  };

  const handleStart = (x, y) => {
    lastPoint.current = { x, y };

    pathRef.current += ` M ${x.toFixed(1)} ${y.toFixed(
      1
    )} L ${(x + 0.1).toFixed(1)} ${y.toFixed(1)}`;

    setPath(pathRef.current);
    markCells(x, y);
  };

  const handleMove = (x, y) => {
    const last = lastPoint.current;

    if (!last) {
      handleStart(x, y);
      return;
    }

    // Beech ke points bhi mark karo taaki tez ungli par gap na rahe
    const distance = Math.hypot(
      x - last.x,
      y - last.y
    );
    const steps = Math.max(
      1,
      Math.ceil(distance / (BRUSH / 3))
    );

    for (let i = 1; i <= steps; i++) {
      markCells(
        last.x + ((x - last.x) * i) / steps,
        last.y + ((y - last.y) * i) / steps
      );
    }

    lastPoint.current = { x, y };

    pathRef.current += ` L ${x.toFixed(1)} ${y.toFixed(
      1
    )}`;

    setPath(pathRef.current);
    checkProgress();
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () =>
        !doneRef.current,
      onStartShouldSetPanResponderCapture: () =>
        !doneRef.current,
      onMoveShouldSetPanResponder: () =>
        !doneRef.current,
      onMoveShouldSetPanResponderCapture: () =>
        !doneRef.current,

      // Scroll ya koi aur view gesture na chheen sake
      onPanResponderTerminationRequest: () =>
        false,

      onPanResponderGrant: (event) => {
        const { locationX, locationY } =
          event.nativeEvent;

        startPoint.current = {
          x: locationX,
          y: locationY,
        };

        handleStart(locationX, locationY);
      },

      onPanResponderMove: (_event, gesture) => {
        if (doneRef.current) return;

        handleMove(
          startPoint.current.x + gesture.dx,
          startPoint.current.y + gesture.dy
        );
      },

      onPanResponderRelease: () => {
        lastPoint.current = null;
        checkProgress();
      },

      onPanResponderTerminate: () => {
        lastPoint.current = null;
      },
    })
  ).current;

  return (
    <View
      style={[styles.card, { width, height }]}
      {...pan.panHandlers}
    >
      {/* ===== Neeche wala reward ===== */}

      <View style={styles.prize} pointerEvents="none">
        <Text style={styles.prizeKicker}>
          YOU WON
        </Text>

        <Text style={styles.prizeAmount}>
          {amount > 0 ? `₹${amount}` : '🎁'}
        </Text>

        <Text style={styles.prizeSub}>
          Cashback added to your rewards
        </Text>
      </View>

      {/* ===== Upar wali foil ===== */}

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { opacity: foilOpacity },
        ]}
        pointerEvents="none"
      >
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient
              id="foil"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <Stop
                offset="0"
                stopColor="#B7C4D6"
              />
              <Stop
                offset="0.5"
                stopColor="#E9EEF5"
              />
              <Stop
                offset="1"
                stopColor="#A5B3C7"
              />
            </LinearGradient>

            <Mask
              id="scratchMask"
              x="0"
              y="0"
              width={width}
              height={height}
            >
              <Rect
                x="0"
                y="0"
                width={width}
                height={height}
                fill="white"
              />

              {path ? (
                <Path
                  d={path}
                  stroke="black"
                  strokeWidth={BRUSH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : null}
            </Mask>
          </Defs>

          <G mask="url(#scratchMask)">
            <Rect
              x="0"
              y="0"
              width={width}
              height={height}
              fill="url(#foil)"
            />

            <Circle
              cx={width * 0.15}
              cy={height * 0.2}
              r="46"
              fill="#FFFFFF"
              opacity="0.22"
            />
            <Circle
              cx={width * 0.88}
              cy={height * 0.82}
              r="62"
              fill="#FFFFFF"
              opacity="0.18"
            />
            <Circle
              cx={width * 0.72}
              cy={height * 0.12}
              r="26"
              fill="#8EA0B8"
              opacity="0.2"
            />

            <SvgText
              x={width / 2}
              y={height / 2 - 2}
              fill="#5F7189"
              fontSize="21"
              fontWeight="bold"
              textAnchor="middle"
            >
              SCRATCH HERE
            </SvgText>

            <SvgText
              x={width / 2}
              y={height / 2 + 22}
              fill="#7C8CA3"
              fontSize="12"
              textAnchor="middle"
            >
              to reveal your cashback
            </SvgText>
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFF8E8',
    borderWidth: 1,
    borderColor: '#F5E2B8',
  },

  prize: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:30,
    paddingHorizontal: 16,
  },

  prizeKicker: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    color: colors.orange,
  },

  prizeAmount: {
    fontSize: 46,
    fontWeight: '900',
    color: colors.navy,
    marginTop: 4,
  },

  prizeSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
    fontWeight: '600',
  },
});