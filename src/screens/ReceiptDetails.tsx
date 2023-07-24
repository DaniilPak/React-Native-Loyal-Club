import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { getBusinessInfoByBid, getDetailedReceipt } from '../utils/api';
import TextBlock from '../components/TextBlock';
import TextBlockV2 from '../components/TextBlockV2';
import Con from '../constants';

import moment from 'moment';

interface ReceiptDetailsProps {
    navigation: any;
    route: any;
}

function ReceiptDetails({ route }: ReceiptDetailsProps) {
    const { _receiptId, businessId } = route.params;
    const [detailedReceipt, setDetailedReceipt] = useState([]);
    const [businessObject, setBusinessObject] = useState([]);
    const [allSet, setAllSet] = useState(false);

    useEffect(() => {
        console.log("Receipt details init ", _receiptId, "businessId: ", businessId);

        getDetailedReceipt(_receiptId)
            .then(detailedReceipt => {
                console.log("Got detailed receipt", detailedReceipt);
                setDetailedReceipt(detailedReceipt);
            })
            .finally(() => setAllSet(true))
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {allSet &&
                <View>
                    <TextBlockV2 text={`Client: ${detailedReceipt.receiptObject.clientNameSurname}`} />
                    <TextBlockV2 text={`Worker: ${detailedReceipt.receiptObject.workerNameSurname}`} />

                    <TextBlockV2 text={`Purchase date: ${moment(detailedReceipt.receiptObject.purchaseDate).format("DD.MM.YYYY HH:mm")}`} />
                    <TextBlockV2 text={`Payment: ${detailedReceipt.receiptObject.inputDigitMoneyValue} ${detailedReceipt.receiptObject.currencySign}`} />
                    <TextBlockV2 text={`Paid with bonus: ${detailedReceipt.receiptObject.minusBonus} ${detailedReceipt.receiptObject.currencySign}`} />
                    <TextBlockV2 text={`Paid: ${detailedReceipt.receiptObject.purchaseAmount} ${detailedReceipt.receiptObject.currencySign}`} />
                    <TextBlockV2 text={`Bonus given: ${detailedReceipt.receiptObject.bonusAmount} ${detailedReceipt.receiptObject.currencySign}`} />
                </View>
            }
            {!allSet &&
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Con.AppleBlueLight} />
                </View>}
        </View>
    );
}

export default ReceiptDetails;