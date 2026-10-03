import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { colors, spacing } from '../theme/theme';

/*
 * Screen ke andar jo bhi <Input /> hai, focus hone par wo apne aap
 * scroll hoke keyboard ke upar aa jata hai (Input.js is context ko use karta hai).
 */
export const ScreenScrollContext = createContext(null);

// Focus hone par input screen ke top se itna neeche rakhna hai (px)
const FOCUS_TOP_MARGIN = 24;

// Keyboard khula ho to niche extra jagah, taaki last inputs bhi upar tak scroll ho sakein
const KEYBOARD_EXTRA_PADDING = 320;

export default function Screen({
  children,
  scroll = true,
  contentStyle,
  footer,
}) {
  const insets = useSafeAreaInsets();

  const scrollRef = useRef(null);
  const scrollY = useRef(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Kisi bhi input (node) ko ScrollView mein top ke paas le aao
  const scrollToInput = useCallback((node) => {
    if (!node || !scrollRef.current) {
      return;
    }

    // keyboard + padding ka layout settle hone do
    setTimeout(() => {
      const scrollView = scrollRef.current;

      if (!scrollView || !node.measureInWindow) {
        return;
      }

      node.measureInWindow((x, y) => {
        scrollView.measureInWindow((sx, sy) => {
          const target = scrollY.current + (y - sy) - FOCUS_TOP_MARGIN;

          scrollView.scrollTo({
            y: Math.max(0, target),
            animated: true,
          });
        });
      });
    }, 300);
  }, []);

  const contextValue = useMemo(
    () => ({ scrollToInput }),
    [scrollToInput]
  );

  const body = scroll ? (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      onScroll={(e) => {
        scrollY.current = e.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
      contentContainerStyle={[
        styles.content,
        contentStyle,
        footer && styles.contentWithFooter,
        keyboardVisible && styles.contentKeyboard,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        contentStyle,
        footer && styles.contentWithFooter,
      ]}
    >
      {children}
    </View>
  );

  return (
    <ScreenScrollContext.Provider value={contextValue}>
     <SafeAreaView
  style={styles.safe}
  edges={
    footer
      ? ['top', 'left', 'right']
      : ['top', 'left', 'right', 'bottom']
  }
>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {body}
        </KeyboardAvoidingView>

        {footer && (
          <View
            style={[
              styles.footer,
              {
                paddingBottom: Math.max(insets.bottom, 8),
              },
            ]}
          >
            {footer}
          </View>
        )}
      </SafeAreaView>
    </ScreenScrollContext.Provider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  flex: {
    flex: 1,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: 42,
  },

  contentWithFooter: {
    paddingBottom: 115,
  },

  contentKeyboard: {
    paddingBottom: KEYBOARD_EXTRA_PADDING,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: colors.white,

    borderTopWidth: 1,
    borderTopColor: colors.border,

    paddingTop: 8,

    elevation: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },
});