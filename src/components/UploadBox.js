import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { FileUp, Image as ImageIcon, X } from 'lucide-react-native';
import { colors, radius } from '../theme/theme';

export default function UploadBox({title,file,onPress,onRemove,subtitle='JPG, PNG or PDF · Max 5 MB'}){
 return <Pressable onPress={onPress} style={styles.box}>
   {file?.uri ? <View style={styles.previewWrap}><Image source={{uri:file.uri}} style={styles.preview}/><Pressable onPress={onRemove} style={styles.remove}><X size={16} color={colors.white}/></Pressable></View> : <><View style={styles.icon}><ImageIcon size={25} color={colors.blue}/></View><Text style={styles.title}>{title}</Text><Text style={styles.sub}>{subtitle}</Text></>}
 </Pressable>
}
const styles=StyleSheet.create({box:{minHeight:155,borderWidth:1,borderStyle:'dashed',borderColor:'#B9C8DE',borderRadius:radius.md,backgroundColor:'#FBFDFF',alignItems:'center',justifyContent:'center',padding:14,marginBottom:16},icon:{width:50,height:50,borderRadius:12,backgroundColor:colors.blueSoft,alignItems:'center',justifyContent:'center',marginBottom:10},title:{fontSize:14,fontWeight:'800',color:colors.text,textAlign:'center'},sub:{fontSize:11,color:colors.muted,marginTop:6,textAlign:'center'},previewWrap:{width:'100%',height:190,borderRadius:10,overflow:'hidden',position:'relative'},preview:{width:'100%',height:'100%',resizeMode:'cover'},remove:{position:'absolute',right:8,top:8,width:30,height:30,borderRadius:15,backgroundColor:'rgba(20,33,61,.8)',alignItems:'center',justifyContent:'center'}});
