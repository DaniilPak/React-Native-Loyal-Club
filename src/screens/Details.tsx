import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Con from '../constants';
import TextBlock from '../components/TextBlock';
import TextMultiBlock from '../components/TextMultiBlock';
import BlueButton from '../components/BlueButton';

interface QRDetailScreenProps {
    navigation: any;
    route: any;
}

function QRDetail({ route }: QRDetailScreenProps) {
    const { qrData } = route.params;

    const [moneyValue, setMoneyValue] = useState('');
    const [bonus, setBonus] = useState('');
    const [saveBonus, setSaveBonus] = useState(100);
    const [summary, setSummary] = useState('');

    const [switcherEnabled, setSwitcherEnabled] = useState(false);

    const buttonOffset = 'Принять оплату';
    const currencySign = '₸';
    const loyaltyPercent = 3;

    const handleMoneyChange = (text: string) => {
        setSwitcherEnabled(false);
        recalculateSummary();
        // Remove all non-digit characters
        const pureNumber = text.replace(/[^0-9]/g, '');
        const bonus = (parseInt(pureNumber) / 100) * loyaltyPercent;
        const roundedBonus = Math.ceil(bonus);
        setBonus(`${roundedBonus} ${currencySign}`);
        setMoneyValue(text);
        setSummary(text);
    };

    const buttonHandle = () => {
        console.log("Button triggered");
    }

    const onSwitcherChange = () => {
        setSwitcherEnabled(!switcherEnabled);
        recalculateSummary();
    }

    const recalculateSummary = () => {
        if (!switcherEnabled) {
            // Remove all non-digit characters
            const pureNumber = moneyValue.replace(/[^0-9]/g, '');
            const calculatedSummary = parseInt(pureNumber) - saveBonus;
            setSummary(`${calculatedSummary} ${currencySign}`);
        } else {
            // Remove all non-digit characters
            const pureNumber = moneyValue.replace(/[^0-9]/g, '');
            const calculatedSummary = parseInt(pureNumber);
            setSummary(`${calculatedSummary} ${currencySign}`);
        }
    }

    const iconSize = 25;
    const iconColor = Con.AppleBlueLight;
    const personIcon = <Ionicons name="person-circle-outline" size={iconSize} color={iconColor} />;
    const switcher = <Switch
        trackColor={{ false: "#999", true: Con.AppleBlueLight }}
        ios_backgroundColor={'#999'}
        onValueChange={onSwitcherChange}
        value={switcherEnabled}
    />

    return (
        <View style={{ flex: 1 }}>
            <TextBlock text='Name Surname' icon={personIcon}></TextBlock>
            <TextInputMask
                type="money"
                options={{
                    precision: 0, // The number of decimal places
                    separator: '.', // Decimal separator
                    delimiter: ' ', // Thousand separator
                    unit: currencySign, // Currency symbol
                    suffixUnit: '', // Optional suffix unit
                }}
                value={moneyValue} // Pass your input value here
                onChangeText={text => handleMoneyChange(text)} // Handle the input change
                keyboardType="numeric" // Set the keyboard type to numeric
                style={styles.input}
            />
            <TextMultiBlock
                text1={`Потратить бонусы ${saveBonus} ${currencySign}`}
                text2='Процент начисления'
                text3='Будет начислено'
                text4='Итого'
                switcher={switcher}
                value2='3%'
                value3={bonus}
                value4={`${summary}`}
            />

            <BlueButton title={`${buttonOffset} ${summary}`} onPress={buttonHandle} />
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
        fontSize: 30
    },
});

export default QRDetail;