import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';
import Octicons from 'react-native-vector-icons/Octicons';
Octicons.loadFont();
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-paper';

interface ChatRowProps {
  text: string;
  secondaryText: string;
  isSeen: boolean;
  onPress: any;
}

function ChatRow({ text, secondaryText, isSeen, onPress }: ChatRowProps) {
  const redDotSize = 25;

  const redDot = <Octicons name="dot-fill" size={redDotSize} color={Con.AppleRedLight} />;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonContainer}>
        <Avatar.Text size={45} label={`${text[0]}`} />
        <View style={{ width: '80%', marginLeft: 15 }}>
          <View style={styles.textBlockContainer}>
            <Text style={styles.textBlock}>{text}</Text>
            {!isSeen && <View style={styles.iconStyle}>{redDot}</View>}
          </View>

          <Text style={styles.textBlockSecondary} numberOfLines={1} ellipsizeMode="tail">
            {secondaryText}
          </Text>
        </View>
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
    height: 80,
    backgroundColor: 'white',
    padding: 17,
    flexDirection: 'row',
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

export default ChatRow;
