import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Con from '../constants';
import { TextInputMask } from 'react-native-masked-text';
import Tip from '../components/Tip';
import TextButton from '../components/TextButton';

interface LoyaltyPercentProps {
    navigation: any;
    route: any;
}

function LoyaltyPercent({ route, navigation }: LoyaltyPercentProps) {

    const [percent, setPercent] = useState('');

    const saveOnPress = () => {

    }

    useEffect(() => {
        // changing title
        navigation.setOptions({
            headerRight: () => (
                <TextButton text='Save' onPress={saveOnPress} />
            ),
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Tip text='Set loyalty percent %' />
            <TextInputMask
                type="only-numbers"
                value={percent} // Pass your input value here
                onChangeText={percent => setPercent(percent)} // Handle the input change
                keyboardType="numeric" // Set the keyboard type to numeric
                style={styles.input}
            />
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
        marginTop: 0,
        fontSize: 30
    },
});

export default LoyaltyPercent;