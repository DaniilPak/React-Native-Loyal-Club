import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image } from 'react-native';
import Con from '../constants';
import ShrinkableContainer from './ShrinkableContainer';

interface LoyaltyCardProps {
  businessName: string;
  bonusAmount: string;
  pictureUrl: string;
}

function LoyaltyCard({ businessName, bonusAmount, pictureUrl }: LoyaltyCardProps) {
  const borderRadius = 35;

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
            flex: 0.1,
            flexDirection: 'row',
          }}
        ></View>
        <View
          style={{
            flex: 0.25,
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
    borderRadius: 35,
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
    fontSize: 18,
    paddingHorizontal: 20,
  },
  canvas: {
    flexDirection: 'column',
    backgroundColor: 'white',
    height: Con.width * 0.9 * 0.6293,
    borderRadius: 35,
    width: Con.width * 0.9,
    alignSelf: 'center',
    marginTop: 25,

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
