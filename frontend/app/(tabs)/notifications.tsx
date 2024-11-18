import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { CustomBackground, CustomText, CustomView } from '@/components'

export default function Notifications() {
  return (
    <CustomBackground style={styles.container}>
      <View>
        <CustomText>Notifications</CustomText>
      </View>
    </CustomBackground>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
  });
  