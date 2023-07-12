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
import { getArrayFromLocalStorage, saveArrayToLocalStorage } from '../utils/async';
import { getLoyaltyCardDetails, updateAuth } from '../utils/api';

interface MyLoyaltyCardsScreenProps {
    navigation: any;
    route: any;
}

function MyLoyaltyCards({ route }: MyLoyaltyCardsScreenProps) {

    const [userData, setUserData] = useState([]);
    const [loyaltyCards, setLoyaltyCards] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = () => {
        try {
            setIsRefreshing(true);
            // Indicate that loading started
            setIsLoading(true);
            initFunc();
        } catch {
            console.log("Failed to refresh");
        } finally {
            setIsRefreshing(false);
        }
    }

    const initFunc = async () => {
        updateAuth()
            .then(apidata => {
                // Saving updated data to LocalStorage
                saveArrayToLocalStorage(apidata, Con.API_AUTH_DATA_KEY);
            })
            .finally(() => {
                getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
                    .then(asyncdata => {
                        console.log("async data my loyalty cards", asyncdata.userData.loyaltyCards);
                        setUserData(asyncdata.userData);
                        const apiLoyaltyCards = asyncdata.userData.loyaltyCards;

                        let tempLoyaltyCards: any[] = [];

                        apiLoyaltyCards.forEach((loyaltyCardId: string) => {
                            getLoyaltyCardDetails(loyaltyCardId)
                                .then(loyaltyCardDetails => {
                                    console.log("++++++++", loyaltyCardDetails);
                                    tempLoyaltyCards.push(loyaltyCardDetails);
                                })
                                .finally(() => {
                                    // Sorting the array alphabetically
                                    tempLoyaltyCards.sort((a, b) => {
                                        const nameA = a.businessName.toUpperCase();
                                        const nameB = b.businessName.toUpperCase();

                                        if (nameA < nameB) {
                                            return -1;
                                        }
                                        if (nameA > nameB) {
                                            return 1;
                                        }
                                        return 0;
                                    });

                                    setLoyaltyCards(tempLoyaltyCards);
                                })
                                .catch(err => {
                                    console.log("Can't get loyalty card details ", err);
                                })
                        });
                    })
                    .finally(() => {
                        setIsLoading(false);
                        console.log("Loyalty cards: ", loyaltyCards);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        initFunc();
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
                    keyExtractor={(item) => item._id}
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
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