import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { getUserByPhoneNumber } from '../utils/api';
import BlueButton from '../components/BlueButton';
import Con from '../constants';
import { showMessage } from 'react-native-flash-message';

interface AuthProps {
  navigation: any;
}

function Auth({ navigation }: AuthProps) {
  const [phoneNumber, setPhoneNumber] = useState('+7 ');

  const phoneNumberRequiredLength = 18;

  const logIn = () => {
    if (phoneNumber.length < phoneNumberRequiredLength) {
      showMessage({
        message: 'Ошибка',
        description: 'Номер телефона неверного формата',
        type: 'warning',
      });

      return;
    }

    getUserByPhoneNumber(phoneNumber)
      .then((user) => {
        if (user) {
          navigation.navigate('Confirmation', { phone: phoneNumber });
        } else {
          // navigate to registration and creation new user
          navigation.navigate('Registration', { phone: phoneNumber });
        }
      })
      .catch((err) => {
        Con.DEBUG && console.log('Cant get user by phone number: ', err);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ color: 'black', alignSelf: 'center' }}>Пожалуйста, введите свой номер телефона</Text>
      <TextInputMask
        type="custom"
        options={{
          mask: '+7 (999) 999-99-99',
        }}
        value={phoneNumber}
        onChangeText={(formatted) => {
          setPhoneNumber(formatted);
        }}
        keyboardType="numeric"
        placeholder="+7"
        placeholderTextColor="#111"
        autoFocus={true}
        style={styles.input}
      />
      <BlueButton title="Продолжить" onPress={logIn} />
    </View>
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
    fontSize: 25,
  },
});

export default Auth;
