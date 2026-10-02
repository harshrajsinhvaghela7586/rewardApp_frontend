import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';
export default function Progress({current,total=9}){return <View style={styles.wrap}><View style={styles.track}><View style={[styles.fill,{width:`${Math.min(100,current/total*100)}%`}]} /></View><Text style={styles.text}>{current} / {total}</Text></View>}
const styles=StyleSheet.create({wrap:{marginBottom:20},track:{height:5,backgroundColor:'#E3EAF4',borderRadius:10,overflow:'hidden'},fill:{height:'100%',backgroundColor:colors.blue,borderRadius:10},text:{fontSize:10,fontWeight:'800',color:colors.muted,marginTop:6,textAlign:'right'}});
