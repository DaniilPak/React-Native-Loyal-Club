import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';
import ShrinkableContainer from './ShrinkableContainer';

interface LoyaltyCardProps {
  businessName: string;
  bonusAmount: string;
}

function LoyaltyCard({ businessName, bonusAmount }: LoyaltyCardProps) {
  return (
    <ShrinkableContainer>
      <View style={styles.canvas}>
        <Text style={styles.businessName}>{businessName}</Text>
        <View
          style={{
            flex: 0.25,
            flexDirection: 'row',
          }}
        >
          <Text style={styles.bonusTip}>Бонусы: </Text>
          <Text style={styles.bonusAmount}>{bonusAmount}</Text>
        </View>
      </View>
    </ShrinkableContainer>
  );
}

const styles = StyleSheet.create({
  businessName: {
    color: 'black',
    flex: 1,
    fontWeight: '600',
    fontSize: 24,
  },
  bonusTip: {
    color: 'black',
  },
  bonusAmount: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  canvas: {
    flexDirection: 'column',
    backgroundColor: 'white',
    height: 180,
    borderRadius: 17,
    padding: 10,
    width: Con.width * 0.9,
    alignSelf: 'center',
    marginTop: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
});

export default LoyaltyCard;
