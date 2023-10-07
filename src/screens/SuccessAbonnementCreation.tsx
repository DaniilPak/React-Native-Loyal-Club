import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';

interface SuccessAbonnementCreationProps {
  navigation: any;
  route: any;
}

function SuccessAbonnementCreation({ route, navigation }: SuccessAbonnementCreationProps) {
  const { receiptResponse } = route.params;

  const mainTitle = `Абонемент ${receiptResponse.name} успешно создан!`;
  const secondaryTitle = `Абонемент содержит ${receiptResponse.value} ${receiptResponse.currency} и был куплен за ${receiptResponse.price} ${receiptResponse.buyCurrency}`;

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

export default SuccessAbonnementCreation;
