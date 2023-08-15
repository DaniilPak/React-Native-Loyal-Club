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
            <Text style={{ color: 'black', alignSelf: 'center' }}>Your account exists, please enter a password</Text>
            <Text style={{ color: 'black', alignSelf: 'center' }}>{phone}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={passwordVisibility}
              placeholder="Enter your password"
              placeholderTextColor={'gray'}
            />
            <Button title="Show/Hide" onPress={handlePasswordVisibility} />
            <GrayButton title="Confirm" onPress={confirmPassword} />
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
