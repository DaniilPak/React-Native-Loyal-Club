import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import Con from '../constants';
import ShrinkableContainer from './ShrinkableContainer';
import * as Progress from 'react-native-progress';

interface AbonnementViewProps {
  abonnementName: string;
  pictureUrl: string;
  valueLeft: string;
  timeLeft: string;
  onPress: any;
}

function AbonnementView({ abonnementName, pictureUrl, valueLeft, timeLeft, onPress }: AbonnementViewProps) {
  const borderRadius = Con.universalBorderRadius;

  return (
    <ShrinkableContainer>
      <View style={styles.canvas}>
        <Image
          style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: borderRadius }}
          source={{
            uri: pictureUrl,
          }}
        />
        <View style={styles.overlay} />
        <Text style={styles.businessName}>{abonnementName}</Text>
        <View
          style={{
            flex: 0.6,
            flexDirection: 'column',
          }}
        >
          <Text style={styles.bonusTip}>{`Баланс: ${valueLeft}`}</Text>
          <Text style={styles.bonusTip}>{`Срок действия: ${timeLeft}`}</Text>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.bonusTip}>{`Детали >`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ShrinkableContainer>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: Con.universalBorderRadius,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust the opacity (last value) for the desired dimming effect
  },
  businessName: {
    color: 'white',
    flex: 1,
    alignSelf: 'flex-end',
    fontWeight: '600',
    fontSize: 22,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bonusTip: {
    color: 'white',
    paddingHorizontal: 20,
  },
  canvas: {
    flexDirection: 'column',
    backgroundColor: 'white',
    height: Con.width * 0.9 * 0.6293,
    borderRadius: Con.universalBorderRadius,
    width: Con.width * 0.9,
    alignSelf: 'center',
    marginTop: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default AbonnementView;
