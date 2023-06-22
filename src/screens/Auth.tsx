import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import GrayButton from '../components/GrayButton';
import { TextInputMask } from 'react-native-masked-text';
import { getUserByPhoneNumber } from '../utils/api';
import BlueButton from '../components/BlueButton';

interface AuthProps {
    navigation: any;
}

function Auth({ navigation }: AuthProps) {
    const [phoneNumber, setPhoneNumber] = useState('');

    const logIn = () => {
        getUserByPhoneNumber(phoneNumber)
            .then(user => {
                if (user) {
                    navigation.navigate("Confirmation", { phone: phoneNumber });
                } else {
                    // navigate to registration and creation new user
                    navigation.navigate("Registration", { phone: phoneNumber });
                }
            })
            .catch(err => {
                console.log("Cant get user by phone number: ", err);
            })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black' }}>
                Please enter your phone number
            </Text>
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
                style={styles.input}
            />
            <BlueButton title='Log in' onPress={logIn} />
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

export default Auth;