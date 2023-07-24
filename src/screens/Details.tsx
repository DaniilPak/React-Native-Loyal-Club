import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch, ActivityIndicator, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Con from '../constants';
import TextBlock from '../components/TextBlock';
import TextMultiBlock from '../components/TextMultiBlock';
import BlueButton from '../components/BlueButton';
import { getArrayFromLocalStorage } from '../utils/async';
import { addPayment, getBusinessInfoByBid, getLoyaltyCardDetails, getOrCreateLoyaltyCardByClientIdAndBusinessId, getUserById } from '../utils/api';
import { ScrollView } from 'react-native-gesture-handler';

interface QRDetailScreenProps {
    navigation: any;
    route: any;
}

function QRDetail({ route, navigation }: QRDetailScreenProps) {
    const { qrData } = route.params;
    const clientId = qrData;

    const [isLoading, setIsLoading] = useState(true);

    const [userData, setUserData] = useState([]);
    const [userToken, setUserToken] = useState('');
    const [client, setClient] = useState([]);

    const [moneyValue, setMoneyValue] = useState('');
    const [saveBonus, setSaveBonus] = useState(0);
    const [summary, setSummary] = useState('');

    const [switcherEnabled, setSwitcherEnabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [buttonIsLoading, setButtonIsLoading] = useState(false);

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

        // Button management
        setButtonDisabled(true);
        setButtonIsLoading(true);

        const pureNumberSummary = summary.replace(/[^0-9]/g, '');
        let intSummary = parseInt(pureNumberSummary)
        console.log("Summary number: ", pureNumberSummary);

        let finalBonus = (intSummary / 100) * loyaltyPercent;
        let minusBonus = 0;
        console.log("Final bonus: ", finalBonus);

        // get inpout money value
        const inputMoneyValue = moneyValue.replace(/[^0-9]/g, '');
        const inputDigitMoneyValue = parseInt(inputMoneyValue);

        if (switcherEnabled) {
            if (saveBonus > inputDigitMoneyValue) {
                console.log("Save b and id", saveBonus, inputDigitMoneyValue);
                minusBonus = inputDigitMoneyValue;
            } else {
                console.log("Else scenario");
                minusBonus = saveBonus;
            }
            console.log("minusBonus", minusBonus);
        }

        console.log("intSummary: ", intSummary);
        console.log("All data: ",
            intSummary,
            existingOrCreatedLoyaltyCard._id,
            clientId,
            userData._id,
            Math.ceil(finalBonus),
            Math.ceil(minusBonus),
        );

        addPayment(
            userToken,
            intSummary,
            existingOrCreatedLoyaltyCard._id, // LoyaltycardId
            clientId, // clientId from QR
            userData._id, // Worker id
            Math.ceil(finalBonus),
            Math.ceil(minusBonus),
            inputDigitMoneyValue,
        )
            .then(receiptResponse => {
                console.log("Response from confirming payment", receiptResponse);
                navigation.navigate("SuccessPayment", { receiptResponse });

                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'SuccessPayment',
                            params: {
                                receiptResponse: receiptResponse,
                            },
                        },
                    ],
                });

            })
            .catch(err => {
                console.log("Error with adding a payment", err);
            })
    }

    const onSwitcherChange = () => {
        setSwitcherEnabled(!switcherEnabled);
        recalculateSummary();
    }

    const fetchDataAndSetState = async () => {
        try {
            const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);

            if (asyncdata) {
                // Setting user data from async storage
                console.log("Local storage async data: (QRDetails) ", asyncdata);
                setUserData(asyncdata.userData);
                setUserToken(asyncdata.token);

                const businessId =
                    asyncdata.userData.type === 'Business'
                        ? asyncdata.userData.business
                        : asyncdata.userData.workBusiness;

                // Get User's Loyalty Card by businessId & userId
                // if LoyaltyCard doesn't exist => then create one
                const existingOrCreatedCard = await getOrCreateLoyaltyCardByClientIdAndBusinessId(clientId, businessId);
                console.log("Existing or created loyalty card", existingOrCreatedCard);
                setExistingOrCreatedLoyaltyCard(existingOrCreatedCard);
                // Get and set Save bonus (How much bonus on the loyalty card)
                setSaveBonus(existingOrCreatedCard.bonusAmount);

                const businessDetails = await getBusinessInfoByBid(businessId);
                console.log("Business details", businessDetails);
                // set business settings
                setCurrencySign(businessDetails.currencySign);
                setLoyaltyPercent(businessDetails.loyalPercent);

                // changing title
                navigation.setOptions({ title: businessDetails.name });

                console.log("client id", clientId);
                // Get clients info
                const user = await getUserById(clientId);
                console.log("Client got: ", user);
                setClient(user);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchDataAndSetState();
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

    const scrollViewRef = useRef();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled keyboardVerticalOffset={100}>
            <ScrollView
                ref={scrollViewRef}
                style={{ marginBottom: 15, flex: 1 }}
            >
                {!isLoading &&
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>
                            <TextBlock text={`Client: ${client.name} ${client.surname}`} icon={personIcon}></TextBlock>
                            <TextInputMask
                                type="money"
                                autoFocus={true}
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
                                placeholder='Enter check amount'
                                placeholderTextColor={'gray'}
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

                            <BlueButton
                                title={`${buttonOffset} ${summary}`}
                                onPress={confirmPayment}
                                isLoading={buttonIsLoading}
                                isDisabled={buttonDisabled}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                }

                {isLoading &&
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color={Con.AppleBlueLight} />
                    </View>
                }
            </ScrollView>
        </KeyboardAvoidingView>
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