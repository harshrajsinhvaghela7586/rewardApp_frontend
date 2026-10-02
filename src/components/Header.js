import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';

export default function Header({ title, step, subtitle }) {
  return <View style={styles.wrap}>
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
    {step ? <Text style={styles.step}>STEP {step}</Text> : null}
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>;
}
const styles=StyleSheet.create({ header: {
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
    marginLeft: -38,
    marginTop:-20,
    fontSize: 24,
    fontWeight: '900',
    color: colors.navy,
    letterSpacing: -0.5,
  },
wrap:{marginBottom:22},logo:{width:130,height:36,marginBottom:18,alignSelf:'center'},step:{fontSize:11,fontWeight:'800',color:colors.blue,letterSpacing:1,marginBottom:7},title:{fontSize:28,lineHeight:33,fontWeight:'900',color:colors.navy},subtitle:{fontSize:14,lineHeight:21,color:colors.muted,marginTop:7}});
