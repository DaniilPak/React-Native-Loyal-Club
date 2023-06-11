import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';
import GrayButton from '../components/GrayButton';

interface QRScreenProps {
    navigation: any;
}

function QRScreen({ navigation }: QRScreenProps) {
    const [qr, setQr] = useState('');

    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                console.log("My async data token", asyncdata.userData._id);
                setQr(asyncdata.userData._id);
            })
            .catch(err => {
                console.log(err);
            });
    }, [])

    const myLoyaltyCards = "My loyalty cards";
    const showMyLoyaltyCards = () => {
        navigation.navigate("MyLoyaltyCards");
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {qr &&
                <QRCode
                    value={qr}
                    size={200}
                    color='black'
                    backgroundColor='white'
                />}
            <GrayButton title={myLoyaltyCards} onPress={showMyLoyaltyCards} />
        </View>
    );
}

export default QRScreen;
