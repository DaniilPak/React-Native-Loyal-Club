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

import DatePicker from 'react-native-date-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';

interface RegistrationProps {
  navigation: any;
  route: any;
}

function Registration({ navigation, route }: RegistrationProps) {
  const { signIn } = useContext(AuthContext);

  const { phone } = route.params;

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');

  const [date, setDate] = useState(new Date());
  const [dateEntered, setDateEntered] = useState(false);
  const [open, setOpen] = useState(false);

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const validateForm = (name: string, surname: string, password: string) => {
    const errors: any[] = [];

    if (!name.trim()) {
      errors.push('Введите имя');
    }

    if (!surname.trim()) {
      errors.push('Введите фамилию');
    }

    if (!dateEntered) {
      errors.push('Выберите дату рождения');
    }

    if (!password.trim()) {
      errors.push('Введите пароль');
    } else if (password.length < 6) {
      errors.push('Пароль должен быть длиной не менее 6 символов');
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

  const registerNew = () => {
    // Validate
    const errors = validateForm(name, surname, password);

    console.log('Errors: ', errors);

    if (errors.length > 0) {
      showMessage({
        message: 'Ошибка',
        description: errors[0],
        type: 'warning',
      });

      return;
    }

    // Disable register button
    setIsButtonPressed(true);

    // Create new user
    createNewUser(phone, name, surname, date, password)
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
            <Text style={{ color: 'black', alignSelf: 'center' }}>
              Добро пожаловать! Давайте начнем с регистрации и создания чего-то волшебного вместе." 💫✨
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={handleNameChange}
              placeholder="Имя"
              placeholderTextColor={'gray'}
              autoFocus={true}
            />
            <TextInput
              style={styles.input}
              value={surname}
              onChangeText={handleSurnameChange}
              placeholder="Фамилия"
              placeholderTextColor={'gray'}
            />
            <TouchableOpacity style={styles.input} onPress={() => setOpen(true)}>
              {!dateEntered && <Text style={styles.textPlaceholder}>{`Выбрать дату рождения`}</Text>}
              {dateEntered && <Text style={styles.input}>{`${date.toLocaleDateString()}`}</Text>}
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={open}
              date={date}
              onConfirm={(date) => {
                console.log('Date: ', date, typeof date);
                setDateEntered(true);
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
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
    marginTop: 10,
    fontSize: 25,
  },
  textPlaceholder: {
    color: 'gray',
    marginTop: 10,
    fontSize: 25,
    textAlign: 'center',
  },
});

export default Registration;
