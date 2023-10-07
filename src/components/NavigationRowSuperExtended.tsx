import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
MaterialIcons.loadFont();
import { TouchableOpacity } from 'react-native-gesture-handler';

interface NavigationRowSuperExtendedProps {
  text: string;
  secondaryText: string;
  thirdText: string;
  fourthText: string;
  fifthText: string;
  onPress: any;
}

function NavigationRowSuperExtended({
  text,
  secondaryText,
  thirdText,
  fourthText,
  fifthText,
  onPress,
}: NavigationRowSuperExtendedProps) {
  const rowIconSize = 20;

  const rowIcon = <MaterialIcons name="arrow-forward-ios" size={rowIconSize} color={Con.AppleGrayLight} />;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonContainer}>
        <View style={styles.textBlockContainer}>
          <Text style={styles.textBlock}>{text}</Text>
          <View style={styles.iconStyle}>{rowIcon}</View>
        </View>

        <Text style={styles.textBlockSecondary}>{secondaryText}</Text>
        <Text style={styles.textBlockSecondary}>{thirdText}</Text>
        <Text style={styles.textBlockSecondary}>{fourthText}</Text>
        <Text style={styles.textBlockSecondary}>{fifthText}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    flex: 1,
    alignItems: 'flex-end',
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 17,
  },
  textBlockContainer: {
    flexDirection: 'row',
  },
  textBlock: {
    color: 'black',
    fontSize: 16,
    alignItems: 'flex-start',
  },
  textBlockSecondary: {
    color: Con.AppleGrayLight,
    fontSize: 14,
  },
});

export default NavigationRowSuperExtended;
