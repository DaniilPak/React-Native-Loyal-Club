import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Modal, Text } from 'react-native';
import { getBusinessClients, getBusinessInfoByBid } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import moment from 'moment';
import ReceiptRow from '../components/ReceiptRow';
import PressableIcon from '../components/PressableIcon.';
import GrayButton from '../components/GrayButton';
import TextBlockV2 from '../components/TextBlockV2';

interface SettingsProps {
    navigation: any;
    route: any;
}

const Tab = createMaterialTopTabNavigator();

const HistoryTabs = ({ navigation, route }: SettingsProps) => {
    return (
        <Tab.Navigator
            screenOptions={{ swipeEnabled: false }}
        >
            <Tab.Screen name="HistoryPart" component={History} initialParams={{ navigation: navigation }} />
            <Tab.Screen name="BusinessClients" component={BusinessClients} />
        </Tab.Navigator>
    );
};

function BusinessClients() {
    const [businessClients, setBusinessClients] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const initFunc = async () => {
        const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
        const isWorker = asyncdata.userData.type == 'Worker';
        const isBusiness = asyncdata.userData.type == 'Business';

        let clients = [];

        if (isWorker) {
            clients = await getBusinessClients(asyncdata.userData.workBusiness);
        } else if (isBusiness) {
            clients = await getBusinessClients(asyncdata.userData.business);
        } else {
            console.log("Error with getting clients occured");
        }

        console.log("clients", clients);
        setBusinessClients(clients);
        setIsLoaded(true);
    }

    const onRefresh = () => {
        try {
            setIsRefreshing(true);
            // Indicate that loading started
            setIsLoaded(false);
            initFunc();
        } catch {
            Con.DEBUG && console.log("Failed to refresh");
        } finally {
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        initFunc();
    }, []);

    const HeaderComponent = () => (
        <View style={{ marginVertical: 25 }}>
            <TextBlockV2 text={`${businessClients.length} клиентов`} />
        </View>
    );

    const renderItem = function ({ item }: any) {
        return (
            <ReceiptRow
                text={`${item.name} ${item.surname}`}
                secondaryText={`${item.phoneNumber}`}
                value={``}
                valueSecondary={``}
                valueThird={``}
                onPress={() => { }}
            />
        );
    }

    return (
        <View>
            {isLoaded &&
                <FlatList
                    data={businessClients}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    ListHeaderComponent={<HeaderComponent />}
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            }
        </View>
    );
}

function History({ route }: SettingsProps) {
    const { navigation } = route.params;

    const [receipts, setReceipts] = useState([]);
    const [currencySign, setCurrencySign] = useState('');
    const [businessId, setBusinessId] = useState('');

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [businessDetails, setBusinessDetails] = useState([]);

    const receiptDetails = (_receiptId: string) => {
        Con.DEBUG && console.log("Receipt details", _receiptId);
        navigation.navigate("ReceiptDetails", { _receiptId, businessId: businessId })
    }

    const onRefresh = () => {
        try {
            setIsRefreshing(true);
            // Indicate that loading started
            setIsLoading(true);
            initFunc();
        } catch {
            Con.DEBUG && console.log("Failed to refresh");
        } finally {
            setIsRefreshing(false);
        }
    }

    const initFunc = async () => {
        try {
            const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
            Con.DEBUG && console.log("Got async data in History page", asyncdata);

            const businessId = asyncdata.userData.type === 'Business' ? asyncdata.userData.business : asyncdata.userData.workBusiness;
            setBusinessId(businessId);

            // Get business info, and then receipts
            const businessDetails = await getBusinessInfoByBid(businessId);
            setBusinessDetails(businessDetails);
            Con.DEBUG && console.log("Business details: ", businessDetails);

            // Setting receipts
            const businessReceipts = businessDetails.receipts;

            // Sorting by new date
            const sortedReceipts = [...businessReceipts].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
            Con.DEBUG && console.log("Sorted receipts: ", sortedReceipts);

            setReceipts(sortedReceipts);
            // Setting currency of the business
            setCurrencySign(businessDetails.currencySign);

            setIsLoading(false);
        } catch (err) {
            Con.DEBUG && console.log(err);
        }
    };

    const openFilterModal = () => {
        setModalVisible(true);
    }

    /// Filters
    const filterByLast7Days = async () => {
        // Close modal
        setModalVisible(false);

        // Start loading layout
        setIsLoading(true);

        // Get the current date
        const currentDate = new Date();

        // Get the date of 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Filter receipts for the last 7 days
        const filteredReceipts = businessDetails.receipts.filter(
            (receipt) => new Date(receipt.purchaseDate) >= sevenDaysAgo && new Date(receipt.purchaseDate) <= currentDate
        );
        Con.DEBUG && console.log("Filtered receipts within last 7 days: ", filteredReceipts);

        // Sorting by new date
        const sortedReceipts = filteredReceipts.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        Con.DEBUG && console.log("Sorted receipts: ", sortedReceipts);

        // Setting Flat List filtered receipts
        setReceipts(sortedReceipts);

        // End loading
        setIsLoading(false);
    };


    const filterByThisMonth = async () => {
        // Close modal
        setModalVisible(false);

        // Start loading layout
        setIsLoading(true);

        // Get the current date
        const currentDate = new Date();

        // Get the first day of the current month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        Con.DEBUG && console.log("First month day: ", firstDayOfMonth);

        // Filter receipts for the current month
        const filteredReceipts = businessDetails.receipts.filter(
            (receipt) => new Date(receipt.purchaseDate) >= firstDayOfMonth && new Date(receipt.purchaseDate) <= currentDate
        );
        Con.DEBUG && console.log("Filtered receipts within this month: ", filteredReceipts);

        // Sorting by new date
        const sortedReceipts = filteredReceipts.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        Con.DEBUG && console.log("Sorted receipts: ", sortedReceipts);

        // Setting Flat List filtered receipts
        setReceipts(sortedReceipts);

        // End loading
        setIsLoading(false);
    };


    const filterByAllTime = async () => {
        // Close modal
        setModalVisible(false);

        // Start loading layout
        setIsLoading(true);

        // Setting receipts
        const businessReceipts = businessDetails.receipts;

        // Sorting by new date
        const sortedReceipts = [...businessReceipts].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        Con.DEBUG && console.log("Sorted receipts: ", sortedReceipts);

        setReceipts(sortedReceipts);

        // Close modal
        setModalVisible(false);

        /// End loading
        setIsLoading(false);
    }

    useEffect(() => {
        initFunc();

        navigation.setOptions({
            headerRight: () => (
                <PressableIcon onPress={() => openFilterModal()} icon='filter' />
            ),
        });
    }, []);

    const renderItem = function ({ item }: any) {
        const formattedDate = moment(item.purchaseDate).format("DD.MM.YYYY HH:mm");

        return (
            <ReceiptRow
                text={`${item.clientNameSurname}`}
                secondaryText={formattedDate}
                value={`${item.purchaseAmount} ${currencySign}`}
                valueSecondary={`+ ${item.bonusAmount} ${currencySign}`}
                valueThird={`- ${item.minusBonus} ${currencySign}`}
                onPress={() => receiptDetails(item._id)}
            />
        );
    }

    return (
        <View style={{ flex: 1, paddingTop: 10 }}>
            {!isLoading &&
                <FlatList
                    data={receipts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            }
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <GrayButton title="Last 7 days" onPress={() => filterByLast7Days()} />
                    <GrayButton title="This month" onPress={() => filterByThisMonth()} />
                    <GrayButton title="All time" onPress={() => filterByAllTime()} />
                </View>
            </Modal>
            {isLoading &&
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Con.AppleBlueLight} />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
});

export default HistoryTabs;