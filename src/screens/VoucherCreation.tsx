import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import Con from '../constants';
import { getArrayFromLocalStorage } from '../utils/async';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import BlueButton from '../components/BlueButton';
import { createVoucher } from '../utils/api';
import { showMessage } from 'react-native-flash-message';

interface VoucherCreationProps {
  navigation: any;
  route: any;
}

function VoucherCreation({ route, navigation }: VoucherCreationProps) {
  const createVoucherTitle: string = 'Создать ваучер';

  const [userData, setUserData] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [daysBeforeExpiration, setDaysBeforeExpiration] = useState('');

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);

  const handleInputChange = (text: any, inputField: string) => {
    if (inputField === 'voucherCode') {
      setVoucherCode(text);
    } else if (inputField === 'bonusAmount') {
      setBonusAmount(text);
    } else if (inputField === 'daysBeforeExpiration') {
      setDaysBeforeExpiration(text);
    }

    // Check if all fields are filled to enable the button
    if (voucherCode.length > 0 && bonusAmount.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  };

  const handleCreateVoucher = async () => {
    try {
      // Add your logic for creating the voucher here
      console.log('Creating voucher:', {
        voucherCode,
        bonusAmount,
        daysBeforeExpiration,
      });

      // Button management
      setButtonDisabled(true);
      setButtonIsLoading(true);

      // Sending request
      const currentBusinessId: string = userData.business;
      const bonusAmountNumber: number = parseInt(bonusAmount, 10);
      const daysBeforeExpirationNumber: number = parseInt(daysBeforeExpiration, 10);

      const createdVoucher = await createVoucher(
        currentBusinessId,
        voucherCode.toUpperCase(),
        bonusAmountNumber,
        daysBeforeExpirationNumber
      );

      showMessage({
        message: 'Успешно создан ваучер!',
        description: 'Ваучер готов к выпуску',
        type: 'success',
      });

      // Reset button state on success
      navigation.navigate('Vouchers');
    } catch (error) {
      showMessage({
        message: 'Ошибка. Ваучер уже занят.',
        description: 'Попробуйте другой промокод',
        type: 'warning',
      });

      // Reset button state on failure
      setButtonDisabled(false);
      setButtonIsLoading(false);
    }
  };

  useEffect(() => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        Con.DEBUG && console.log('async data Statistics', asyncdata.userData);
        setUserData(asyncdata.userData);
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);
      });
  }, []);

  return (
    <ScrollView>
      <TextInput
        placeholderTextColor={'gray'}
        style={styles.input}
        placeholder="Код ваучера"
        value={voucherCode}
        onChangeText={(text) => handleInputChange(text, 'voucherCode')}
      />
      <TextInput
        placeholderTextColor={'gray'}
        style={styles.input}
        placeholder="Сумма бонуса"
        keyboardType="numeric"
        value={bonusAmount}
        onChangeText={(text) => handleInputChange(text, 'bonusAmount')}
      />
      <TextInput
        placeholderTextColor={'gray'}
        style={styles.input}
        placeholder="Дней до истечения"
        keyboardType="numeric"
        value={daysBeforeExpiration}
        onChangeText={(text) => handleInputChange(text, 'daysBeforeExpiration')}
      />
      <BlueButton
        title={createVoucherTitle}
        onPress={handleCreateVoucher}
        isLoading={buttonIsLoading}
        isDisabled={buttonDisabled}
        isShadowDisabled={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    textAlign: 'center',
    color: 'black',
    marginTop: 25,
    fontSize: 30,
  },
});

export default VoucherCreation;
