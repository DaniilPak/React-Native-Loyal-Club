import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import Con from '../constants';
import { getArrayFromLocalStorage } from '../utils/async';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlueButton from '../components/BlueButton';
import { showMessage } from 'react-native-flash-message';
import { applyVoucher } from '../utils/api';
Ionicons.loadFont();

interface ApplyVoucherProps {
  navigation: any;
  route: any;
}

function ApplyVoucher({ route, navigation }: ApplyVoucherProps) {
  const applyVoucherTitle: string = 'Применить промокод';

  const [userData, setUserData] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);

  const handleInputChange = (text: any, inputField: string) => {
    if (inputField === 'voucherCode') {
      const uppercaseCode = text.toUpperCase();
      setVoucherCode(uppercaseCode);
    }

    // Check if all fields are filled to enable the button
    if (voucherCode.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  };

  const handleApplyVoucher = async () => {
    // Button management
    setButtonDisabled(true);
    setButtonIsLoading(true);

    // Sending request
    const appliedVoucher = await applyVoucher(voucherCode, userData._id);

    console.log('FFF', appliedVoucher);

    if (appliedVoucher.success) {
      showMessage({
        message: 'Успешно применён ваучер!',
        description: 'Бонусы начислены на ваш аккаунт',
        type: 'success',
      });

      // Reset button state on success
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'HomeScanner',
          },
        ],
      });
    } else {
      showMessage({
        message: 'Не удалось применить ваучер',
        description: 'Ваучер истёк, либо вы уже использовали его ранее',
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
      <BlueButton
        title={applyVoucherTitle}
        onPress={handleApplyVoucher}
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

export default ApplyVoucher;
