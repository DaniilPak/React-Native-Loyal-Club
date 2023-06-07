import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import GrayButton from '../components/GrayButton';
import { TextInputMask } from 'react-native-masked-text';

interface AuthProps {
    navigation: any;
}

function Auth({ navigation }: AuthProps) {
    const [phoneNumber, setPhoneNumber] = useState('');

    const logIn = () => {
        navigation.navigate("Confirmation", { phone: phoneNumber });
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
            <GrayButton title='Log in' onPress={logIn} />
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