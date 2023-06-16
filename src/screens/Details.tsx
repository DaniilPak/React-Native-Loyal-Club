import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Con from '../constants';
import TextBlock from '../components/TextBlock';
import TextMultiBlock from '../components/TextMultiBlock';
import BlueButton from '../components/BlueButton';
import { getArrayFromLocalStorage } from '../utils/async';
import { addPayment, getBusinessInfoByBid, getLoyaltyCardDetails, getOrCreateLoyaltyCardByClientIdAndBusinessId } from '../utils/api';

interface QRDetailScreenProps {
    navigation: any;
    route: any;
}

function QRDetail({ route, navigation }: QRDetailScreenProps) {
    const { qrData } = route.params;
    const clientId = qrData;

    const [userData, setUserData] = useState([]);

    const [moneyValue, setMoneyValue] = useState('');
    const [saveBonus, setSaveBonus] = useState(0);
    const [summary, setSummary] = useState('');

    const [switcherEnabled, setSwitcherEnabled] = useState(false);

    // API data
    const [currencySign, setCurrencySign] = useState('');
    const [loyaltyPercent, setLoyaltyPercent] = useState(0);

    // Loyalty card 
    const [existingOrCreatedLoyaltyCard, setExistingOrCreatedLoyaltyCard] = useState([]);

    const buttonOffset = 'Confirm Payment';

    const handleMoneyChange = (text: string) => {
        setSwitcherEnabled(false);
        recalculateSummary();
        // Remove all non-digit characters
        const pureNumber = text.replace(/[^0-9]/g, '');
        const bonus = (parseInt(pureNumber) / 100) * loyaltyPercent;
        const roundedBonus = Math.ceil(bonus);
        setMoneyValue(text);
        setSummary(text);
    };

    const confirmPayment = () => {
        console.log("Button triggered", summary);

        const pureNumberSummary = summary.replace(/[^0-9]/g, '');
        let intSummary = parseInt(pureNumberSummary)
        console.log("Summary number: ", pureNumberSummary);

        let finalBonus = (intSummary / 100) * loyaltyPercent;
        let minusBonus = 0;
        console.log("Final bonus: ", finalBonus);

        if (switcherEnabled) {
            minusBonus = saveBonus;

            // if intSummary(summary pay amount) is smaller than bonus amount
            // user should pay 0 money, and program should divide bonus 
            // with amount of intSummary
            if (intSummary <= saveBonus) {
                // get digit money value
                // Remove all non-digit characters
                const pureNumber = moneyValue.replace(/[^0-9]/g, '');
                const digitMoneyValue = parseInt(pureNumber);

                minusBonus = digitMoneyValue;
            }

            console.log("minusBonus", minusBonus);
        }

        console.log("intSummary: ", intSummary);
        console.log("All data: ",
            intSummary,
            existingOrCreatedLoyaltyCard._id,
            clientId,
            userData._id,
            finalBonus,
            minusBonus
        );

        addPayment(
            intSummary,
            existingOrCreatedLoyaltyCard._id, // LoyaltycardId
            clientId, // clientId from QR
            userData._id, // Worker id
            Math.ceil(finalBonus),
            Math.ceil(minusBonus),
        )
            .then(apidata => {
                console.log("Response from confirming payment", apidata);
                navigation.navigate("SuccessPayment");
            })
            .catch(err => {
                console.log("Error with adding a payment", err);
            })
    }

    const onSwitcherChange = () => {
        setSwitcherEnabled(!switcherEnabled);
        recalculateSummary();
    }

    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                if (asyncdata) {
                    // Setting user data from async storage
                    console.log("Local storage async data: (QRDetails) ", asyncdata);
                    setUserData(asyncdata.userData);

                    const businessId = asyncdata.userData.business;

                    // Get User's Loyalty Card by businessId & userId
                    // if LoyaltyCard doesn't exist => then create one
                    getOrCreateLoyaltyCardByClientIdAndBusinessId(clientId, businessId)
                        .then(existingOrCreatedCard => {
                            console.log("Existing or created loyalty card", existingOrCreatedCard);
                            setExistingOrCreatedLoyaltyCard(existingOrCreatedCard);
                            // Get and set Save bonus (How much bonus on the loyalty card)
                            setSaveBonus(existingOrCreatedCard.bonusAmount)
                        })
                        .catch(err => {
                            console.log("Error with getting business details", err);
                        });


                    getBusinessInfoByBid(businessId)
                        .then(businessDetails => {
                            console.log("Business details", businessDetails);
                            // set business settings
                            setCurrencySign(businessDetails.currencySign);
                            setLoyaltyPercent(businessDetails.loyalPercent);

                            // changing title
                            navigation.setOptions({ title: businessDetails.name });
                        })
                        .catch(err => {
                            console.log("Error with getting business details", err);
                        });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const recalculateSummary = () => {
        // Remove all non-digit characters
        const pureNumber = moneyValue.replace(/[^0-9]/g, '');
        const digitMoneyValue = parseInt(pureNumber);

        if (!switcherEnabled) {

            if (digitMoneyValue <= saveBonus) {
                setSummary(`0 ${currencySign}`);
            } else {
                const calculatedSummary = digitMoneyValue - saveBonus;
                setSummary(`${calculatedSummary} ${currencySign}`);
            }
        } else {
            const calculatedSummary = digitMoneyValue;
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
                text1={`Spend bonus ${saveBonus} ${currencySign}`}
                text2='Loyalty percent'
                text4='Summary'
                switcher={switcher}
                value2={`${loyaltyPercent}%`}
                value4={`${summary}`}
            />

            <BlueButton title={`${buttonOffset} ${summary}`} onPress={confirmPayment} />
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