import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import GrayButton from '../components/GrayButton';
import { TextInputMask } from 'react-native-masked-text';
import { makeAuth } from '../utils/api';

interface ConfirmationProps {
    navigation: any;
    route: any;
}

function Confirmation({ navigation, route }: ConfirmationProps) {
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
        makeAuth(phone, password);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black' }}>
                Your account exists, please enter a password
            </Text>
            <Text style={{ color: 'black' }}>
                {phone}
            </Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={passwordVisibility}
                placeholder="Enter your password"
            />
            <Button title="Show/Hide" onPress={handlePasswordVisibility} />
            <GrayButton title='Confirm' onPress={confirmPassword} />
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

export default Confirmation;