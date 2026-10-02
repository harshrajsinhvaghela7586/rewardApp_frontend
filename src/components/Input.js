import React, { useContext, useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius } from '../theme/theme';
import { ScreenScrollContext } from './Screen';

export default function Input({ label, error, onFocus, ...props }) {
  const screen = useContext(ScreenScrollContext);
  const wrapRef = useRef(null);

  return (
    <View ref={wrapRef} collapsable={false} style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        {...props}
        placeholderTextColor="#9AA5B5"
        style={[styles.input, error && styles.errorBorder]}
        onFocus={(event) => {
          // Focus hote hi ye input keyboard ke upar scroll ho jata hai
          screen?.scrollToInput(wrapRef.current);
          onFocus?.(event);
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 7,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
  },
  errorBorder: { borderColor: colors.danger },
  error: { fontSize: 11, color: colors.danger, marginTop: 5 },
});