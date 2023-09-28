import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image } from 'react-native';
import Con from '../constants';
import ShrinkableContainer from './ShrinkableContainer';
import * as Progress from 'react-native-progress';

interface LoyaltyCardProps {
  businessName: string;
  bonusAmount: string;
  pictureUrl: string;
  prevLvl: string;
  nextLvl: string;
  progressStat: string;
  progressVal: number;
}

function LoyaltyCard({
  businessName,
  bonusAmount,
  pictureUrl,
  prevLvl,
  nextLvl,
  progressStat,
  progressVal,
}: LoyaltyCardProps) {
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
        <Text style={styles.businessName}>{businessName}</Text>
        <View
          style={{
            flex: 0.25,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          {/* Spent metrics */}
          <Text style={{ color: 'white', position: 'absolute', top: -12 }}>{progressStat}</Text>
          {/* Current lvl */}
          <Text style={{ color: 'white', paddingHorizontal: 7 }}>{prevLvl}</Text>
          <Progress.Bar progress={progressVal} width={Con.width * 0.58} color="rgba(255, 255, 255, 1)" />
          {/* Next lvl */}
          <Text style={{ color: 'white', paddingHorizontal: 7 }}>{nextLvl}</Text>
        </View>
        <View
          style={{
            flex: 0.3,
            flexDirection: 'row',
          }}
        >
          <Text style={styles.bonusTip}>{`Бонусы: ${bonusAmount}`}</Text>
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
    fontSize: 30,
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

export default LoyaltyCard;
