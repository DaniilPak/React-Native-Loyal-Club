import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import NavigationRow from '../components/NavigationRow';
import NavigationRowExtended from '../components/NavigationRowExtended';
import { getBusinessInfoByBid } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';

import moment from 'moment';

interface SettingsProps {
    navigation: any;
    route: any;
}

function History({ route, navigation }: SettingsProps) {
    const [receipts, setReceipts] = useState([]);
    const [currencySign, setCurrencySign] = useState('');
    const [businessId, setBusinessId] = useState('');

    const [isRefreshing, setIsRefreshing] = useState(false);

    const receiptDetails = (_receiptId: string) => {
        console.log("Receipt details", _receiptId);
        navigation.navigate("ReceiptDetails", { _receiptId, businessId: businessId })
    }

    const onRefresh = () => {
        try {
            setIsRefreshing(true);
            initFunc();
        } catch {
            console.log("Failed to refresh");
        } finally {
            setIsRefreshing(false);
        }
    }

    const initFunc = async () => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                console.log("Got async data in History page", asyncdata);
                const businessId = asyncdata.userData.business;
                setBusinessId(businessId);

                // Get business info, and then receipts
                getBusinessInfoByBid(businessId)
                    .then(businessDetails => {
                        console.log("Business details: ", businessDetails);
                        // Setting receipts 
                        const businessReceipts = businessDetails.receipts
                        // Sorting by new date
                        const sortedReceipts = [...businessReceipts].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

                        console.log("Sorted receipts: ", sortedReceipts);

                        setReceipts(sortedReceipts);
                        // Setting currency of the business
                        setCurrencySign(businessDetails.currencySign);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        initFunc();
    }, []);

    const renderItem = function ({ item }: any) {
        const formattedDate = moment(item.purchaseDate).format("DD.MM.YYYY HH:mm");

        return (
            <NavigationRowExtended
                text={`${item.purchaseAmount} ${currencySign}`}
                secondaryText={formattedDate}
                onPress={() => receiptDetails(item._id)}
            />
        );
    }

    return (
        <View style={{ flex: 1, paddingTop: 10 }}>
            {receipts &&
                <FlatList
                    data={receipts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            }
        </View>
    );
}

export default History;