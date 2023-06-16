import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { getBusinessInfoByBid, getDetailedReceipt } from '../utils/api';
import TextBlock from '../components/TextBlock';
import TextBlockV2 from '../components/TextBlockV2';
import Con from '../constants';

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

                getBusinessInfoByBid(businessId)
                    .then(business => {
                        console.log("Business: ", business);
                        setBusinessObject(business);
                    })
                    .finally(() => setAllSet(true))
                    .catch(err => {
                        console.log("Error with getting business info by id in Receipt Details", err);
                    })
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {allSet &&
                <View>
                    <TextBlockV2 text={`Client: ${detailedReceipt.clientObject.name} ${detailedReceipt.clientObject.surname}`} />
                    <TextBlockV2 text={`Worker: ${detailedReceipt.workerObject.name} ${detailedReceipt.workerObject.surname}`} />

                    <TextBlockV2 text={`Purchase amount: ${detailedReceipt.receiptObject.purchaseDate}`} />
                    <TextBlockV2 text={`Purchase amount: ${detailedReceipt.receiptObject.purchaseAmount} ${businessObject.currencySign}`} />
                    <TextBlockV2 text={`Bonus given: ${detailedReceipt.receiptObject.bonusAmount} ${businessObject.currencySign}`} />
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