import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch, FlatList, ActivityIndicator } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Con from '../constants';
import TextBlock from '../components/TextBlock';
import TextMultiBlock from '../components/TextMultiBlock';
import BlueButton from '../components/BlueButton';
import { ScrollView } from 'react-native-gesture-handler';
import TextBlockV2 from '../components/TextBlockV2';
import { getArrayFromLocalStorage } from '../utils/async';
import { getLoyaltyCardDetails } from '../utils/api';

interface MyLoyaltyCardsScreenProps {
    navigation: any;
    route: any;
}

function MyLoyaltyCards({ route }: MyLoyaltyCardsScreenProps) {

    const [userData, setUserData] = useState([]);
    const [loyaltyCards, setLoyaltyCards] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                console.log("async data my loyalty cards", asyncdata.userData.loyaltyCards);
                setUserData(asyncdata.userData);
                const apiLoyaltyCards = asyncdata.userData.loyaltyCards;

                apiLoyaltyCards.forEach((loyaltyCardId: string) => {
                    getLoyaltyCardDetails(loyaltyCardId)
                        .then(loyaltyCardDetails => {
                            console.log("++++++++", loyaltyCardDetails);
                            setLoyaltyCards(prev => [...prev, loyaltyCardDetails]);
                        })
                        .finally(() => {
                            // Loading done
                            setIsLoading(false);
                        })
                        .catch(err => {
                            console.log("Can't get loyalty card details ", err);
                        })
                });
            })
            .catch(err => {
                console.log(err);
            });

        console.log("Loyalty cards: ", loyaltyCards);
    }, []);

    const renderItem = ({ item }: any) => (
        <TextBlockV2 text={`${item.businessName} bonus: ${item.bonusAmount} ${item.currencySign}`} />
    );

    return (
        <View style={{ flex: 1 }}>
            {!isLoading &&
                <FlatList
                    data={loyaltyCards}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                />
            }
            {isLoading &&
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Con.AppleBlueLight} />
                </View>
            }
        </View>
    );
}

export default MyLoyaltyCards;