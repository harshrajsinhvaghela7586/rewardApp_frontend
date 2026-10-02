import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme/theme';
export default function FieldCard({label,value}){return <View style={styles.card}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value || '—'}</Text></View>}
const styles=StyleSheet.create({card:{backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:13,marginBottom:9},label:{fontSize:10,fontWeight:'800',color:colors.muted,textTransform:'uppercase',letterSpacing:.4},value:{fontSize:14,fontWeight:'700',color:colors.text,marginTop:5}});
