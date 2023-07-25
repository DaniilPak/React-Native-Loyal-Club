import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Modal } from 'react-native';
import NavigationRow from '../components/NavigationRow';
import NavigationRowExtended from '../components/NavigationRowExtended';
import { getBusinessInfoByBid, getBusinessReceiptsWithFilter } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';

import moment from 'moment';
import ReceiptRow from '../components/ReceiptRow';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PressableIcon from '../components/PressableIcon.';
import GrayButton from '../components/GrayButton';
import LoadingOverlay from '../components/LoadingOverlay';

interface SettingsProps {
    navigation: any;
    route: any;
}

function History({ route, navigation }: SettingsProps) {
    const [receipts, setReceipts] = useState([]);
    const [currencySign, setCurrencySign] = useState('');
    const [businessId, setBusinessId] = useState('');

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [businessDetails, setBusinessDetails] = useState([]);

    const receiptDetails = (_receiptId: string) => {
        console.log("Receipt details", _receiptId);
        navigation.navigate("ReceiptDetails", { _receiptId, businessId: businessId })
    }

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
            console.log("Got async data in History page", asyncdata);

            const businessId = asyncdata.userData.type === 'Business' ? asyncdata.userData.business : asyncdata.userData.workBusiness;
            setBusinessId(businessId);

            // Get business info, and then receipts
            const businessDetails = await getBusinessInfoByBid(businessId);
            setBusinessDetails(businessDetails);
            console.log("Business details: ", businessDetails);

            // Setting receipts
            const businessReceipts = businessDetails.receipts;

            // Sorting by new date
            const sortedReceipts = [...businessReceipts].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
            console.log("Sorted receipts: ", sortedReceipts);

            setReceipts(sortedReceipts);
            // Setting currency of the business
            setCurrencySign(businessDetails.currencySign);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const openFilterModal = () => {
        setModalVisible(!modalVisible);
    }

    /// Filters
    const filterByLast7Days = async () => {
        // Close modal
        setModalVisible(!modalVisible);

        // Start loading layout
        setIsLoading(true);

        // Get the current date
        const currentDate = new Date();

        // Get the date of 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const filteredReceipts = await getBusinessReceiptsWithFilter(businessDetails._id, sevenDaysAgo, currentDate);
        console.log("Filtered receipts: ", filteredReceipts);

        // Sorting by new date
        const sortedReceipts = filteredReceipts.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        console.log("Sorted receipts: ", sortedReceipts);

        // Setting Flat List filtered receipts
        setReceipts(sortedReceipts);

        /// End loading
        setIsLoading(false);
    }

    const filterByThisMonth = async () => {
        // Close modal
        setModalVisible(!modalVisible);

        // Start loading layout
        setIsLoading(true);

        // Get the current date
        const currentDate = new Date();

        // Get the first day of the current month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        console.log("First month day: ", firstDayOfMonth);

        const filteredReceipts = await getBusinessReceiptsWithFilter(businessDetails._id, firstDayOfMonth, currentDate);
        console.log("Filtered receipts: ", filteredReceipts);

        // Sorting by new date
        const sortedReceipts = filteredReceipts.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        console.log("Sorted receipts: ", sortedReceipts);

        // Setting Flat List filtered receipts
        setReceipts(sortedReceipts);

        /// End loading
        setIsLoading(false);

    }

    const filterByAllTime = async () => {
        // Close modal
        setModalVisible(!modalVisible);

        // Start loading layout
        setIsLoading(true);

        // Setting receipts
        const businessReceipts = businessDetails.receipts;

        // Sorting by new date
        const sortedReceipts = [...businessReceipts].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        console.log("Sorted receipts: ", sortedReceipts);

        setReceipts(sortedReceipts);

        // Close modal
        setModalVisible(!modalVisible);

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
            <LoadingOverlay loading={isLoading} />
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
    },
});

export default History;