import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';

interface SuccessPaymentProps {
  navigation: any;
  route: any;
}

function SuccessPayment({ route, navigation }: SuccessPaymentProps) {
  const { receiptResponse } = route.params;

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
    Con.DEBUG && console.log('receiptResponse', receiptResponse);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.tip}>
          {`${receiptResponse.purchaseAmount} ${receiptResponse.currencySign}`} Оплата прошла успешно
        </Text>
        <Text style={styles.bonusGotText}>
          {`Выписано ${receiptResponse.bonusAmount} ${receiptResponse.currencySign} бонусов`}
        </Text>
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

export default SuccessPayment;
