import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';
import GrayButton from '../components/GrayButton';
import { makeAuth } from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import { setItemToLocalStorage } from '../utils/async';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import { showMessage } from 'react-native-flash-message';

interface ConfirmationProps {
  navigation: any;
  route: any;
}

function Confirmation({ navigation, route }: ConfirmationProps) {
  const { signIn } = useContext(AuthContext);

  const { phone } = route.params;

  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const handlePasswordChange = (text: any) => {
    setPassword(text);
  };

  const handlePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const confirmPassword = () => {
    makeAuth(phone, password)
      .then((apidata) => {
        signIn(apidata);
        // Saving credentials
        setItemToLocalStorage(Con.PHONE_ASYNC_KEY, phone);
        setItemToLocalStorage(Con.PASSWORD_ASYNC_KEY, password);
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);

        showMessage({
          message: 'Пароль неверный',
          description: 'Пожалуйста попробуйте еще раз',
          type: 'danger',
        });
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ justifyContent: 'center', flex: 1, height: Con.height }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: 'black', alignSelf: 'center', textAlign: 'center', width: Con.width * 0.9 }}>
              Ваша учетная запись существует, пожалуйста, введите пароль для
            </Text>
            <Text style={{ color: 'black', alignSelf: 'center' }}>{phone}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={passwordVisibility}
              placeholder="Введите пароль"
              placeholderTextColor={'gray'}
            />
            <Button title="показать/скрыть" onPress={handlePasswordVisibility} />
            <BlueButton title="Подтвердить" onPress={confirmPassword} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 60,
    textAlign: 'center',
    color: 'black',
    marginTop: 25,
    fontSize: 25,
  },
});

export default Confirmation;
