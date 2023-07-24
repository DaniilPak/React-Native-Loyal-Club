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
import { getLoyaltyCardDetails, getUserById, updateAuth } from '../utils/api';

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
        try {
            const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
            const user = await getUserById(asyncdata.userData._id);
            console.log("User got: ", user);

            setUserData(asyncdata.userData);
            const apiLoyaltyCards = user.loyaltyCards;

            const loyaltyCardPromises = apiLoyaltyCards.map(loyaltyCardId => getLoyaltyCardDetails(loyaltyCardId));

            const tempLoyaltyCards = await Promise.all(loyaltyCardPromises);
            console.log("++++++++", tempLoyaltyCards);

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
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };


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