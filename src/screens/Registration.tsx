import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import GrayButton from '../components/GrayButton';
import { TextInputMask } from 'react-native-masked-text';
import { createNewUser, makeAuth } from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import { setItemToLocalStorage } from '../utils/async';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import { pushAlert } from '../utils/alert';

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
        console.log("Ok");
    }

    const registerNew = () => {
        // Validate 
        const errors = validateForm(name, surname, password);

        const errorKeys = Object.entries(errors);
        console.log("Errors: ", errorKeys);

        if (errorKeys.length > 0) {
            errorKeys.forEach(err => {
                pushAlert("Error", err[1], okFunc);
            });

            return;
        }

        // Create new user
        createNewUser(phone, name, surname, password)
            .then(newUser => {
                console.log("newUser", newUser);

                // Got new user info and now 
                // lets auth

                makeAuth(newUser.phoneNumber, password)
                    .then(apidata => {
                        // Saving credentials 
                        setItemToLocalStorage(Con.PHONE_ASYNC_KEY, phone)
                        setItemToLocalStorage(Con.PASSWORD_ASYNC_KEY, password);

                        signIn(apidata);
                    })
                    .catch(err => {
                        console.log("Error with making auth after register ", err);
                    });
            })
            .catch(err => {
                console.log("Error with creating new user: ", err);
            })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black' }}>
                Lets create an account for
            </Text>
            <Text style={{ color: 'black' }}>
                {phone}
            </Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={handleNameChange}
                placeholder="Name"
                placeholderTextColor={'gray'}
            />
            <TextInput
                style={styles.input}
                value={surname}
                onChangeText={handleSurnameChange}
                placeholder="Surname"
                placeholderTextColor={'gray'}
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={passwordVisibility}
                placeholder="Password"
                placeholderTextColor={'gray'}
            />
            <Button title="Show/Hide" onPress={handlePasswordVisibility} />
            <BlueButton title='Register' onPress={registerNew} />
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
        fontSize: 25
    },
});

export default Registration;