import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';

interface SuccessVisitCreationProps {
  navigation: any;
  route: any;
}

function SuccessVisitCreation({ route, navigation }: SuccessVisitCreationProps) {
  const { receiptResponse } = route.params;

  const mainTitle = `Визит успешно подтверждён! (${receiptResponse.name})`;
  const secondaryTitle = `Осталось ${receiptResponse.value}/${receiptResponse.totalValue} ${receiptResponse.currency}`;

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeScanner',
        },
      ],
    });
  };

  useEffect(() => {
    console.log('receiptResponse', receiptResponse);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.tip}>{mainTitle}</Text>
        <Text style={styles.bonusGotText}>{secondaryTitle}</Text>
      </View>

      <BlueButton title="Готово" onPress={goHome} />
    </View>
  );
}

const styles = StyleSheet.create({
  tip: {
    color: 'black',
    textAlignVertical: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  bonusGotText: {
    color: Con.AppleGreenLight,
  },
});

export default SuccessVisitCreation;
