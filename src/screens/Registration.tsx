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
  Keyboard,
  ScrollView,
} from 'react-native';
import { createNewUser, makeAuth } from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import { setItemToLocalStorage } from '../utils/async';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import { pushAlert } from '../utils/alert';
import ReCAPTCHA from 'react-native-recaptcha-v2';

interface RegistrationProps {
  navigation: any;
  route: any;
}

interface Errors {
  name?: string;
  surname?: string;
  password?: string;
}

function Registration({ navigation, route }: RegistrationProps) {
  const { signIn } = useContext(AuthContext);

  const { phone } = route.params;

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const validateForm = (name: string, surname: string, password: string) => {
    let errors: Errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!surname.trim()) {
      errors.surname = 'Surname is required';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password should be at least 6 characters long';
    }

    return errors;
  };

  const handleNameChange = (nameVal: any) => {
    setName(nameVal);
  };

  const handleSurnameChange = (surnameVal: any) => {
    setSurname(surnameVal);
  };

  const handlePasswordChange = (passwordVal: any) => {
    setPassword(passwordVal);
  };

  const handlePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const okFunc = () => {
    Con.DEBUG && console.log('Ok');
  };

  const registerNew = () => {
    setIsButtonPressed(true);

    // Validate
    const errors = validateForm(name, surname, password);

    const errorKeys = Object.entries(errors);
    Con.DEBUG && console.log('Errors: ', errorKeys);

    if (errorKeys.length > 0) {
      errorKeys.forEach((err) => {
        pushAlert('Error', err[1], okFunc);
      });

      return;
    }

    // Create new user
    createNewUser(phone, name, surname, password)
      .then((newUser) => {
        Con.DEBUG && console.log('newUser', newUser);

        // Got new user info and now
        // lets auth

        makeAuth(newUser.phoneNumber, password)
          .then((apidata) => {
            // Saving credentials
            setItemToLocalStorage(Con.PHONE_ASYNC_KEY, phone);
            setItemToLocalStorage(Con.PASSWORD_ASYNC_KEY, password);

            signIn(apidata);
          })
          .catch((err) => {
            Con.DEBUG && console.log('Error with making auth after register ', err);
          });
      })
      .catch((err) => {
        Con.DEBUG && console.log('Error with creating new user: ', err);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ justifyContent: 'center', flex: 1, height: Con.height }}
        >
          <View>
            <Text style={{ color: 'black', alignSelf: 'center' }}>Давайте создадим учетную запись для</Text>
            <Text style={{ color: 'black', alignSelf: 'center' }}>{phone}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={handleNameChange}
              placeholder="Имя"
              placeholderTextColor={'gray'}
            />
            <TextInput
              style={styles.input}
              value={surname}
              onChangeText={handleSurnameChange}
              placeholder="Фамилия"
              placeholderTextColor={'gray'}
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={passwordVisibility}
              placeholder="Пароль"
              placeholderTextColor={'gray'}
            />
            <Button title="показать/скрыть" onPress={handlePasswordVisibility} />
            <BlueButton
              title="Зарегистрироваться"
              onPress={registerNew}
              isLoading={isButtonPressed}
              isDisabled={isButtonPressed}
            />
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
    backgroundColor: 'white',
    textAlign: 'center',
    color: 'black',
    marginTop: 25,
    fontSize: 25,
  },
});

export default Registration;
