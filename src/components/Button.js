import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme/theme';

export default function Button({ title, onPress, loading=false, disabled=false, variant='primary', style }) {
  return (
    <Pressable disabled={disabled || loading} onPress={onPress} style={({pressed}) => [styles.base, variant === 'secondary' && styles.secondary, variant === 'outline' && styles.outline, pressed && styles.pressed, (disabled || loading) && styles.disabled, style]}>
      {loading ? <ActivityIndicator color={variant === 'outline' ? colors.blue : colors.white} /> : <Text style={[styles.text, variant !== 'primary' && styles.darkText]}>{title}</Text>}
    </Pressable>
  );
}
const styles=StyleSheet.create({
 base:{height:52,borderRadius:radius.md,backgroundColor:colors.blue,alignItems:'center',justifyContent:'center',paddingHorizontal:22},
 secondary:{backgroundColor:colors.navy}, outline:{backgroundColor:colors.white,borderWidth:1.5,borderColor:colors.blue},
 text:{fontSize:16,fontWeight:'800',color:colors.white},darkText:{color:colors.blue},pressed:{transform:[{scale:.985}]},disabled:{opacity:.55}
});
