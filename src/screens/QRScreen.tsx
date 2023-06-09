import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';
import GrayButton from '../components/GrayButton';
import BlueButton from '../components/BlueButton';

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
        <View style={styles.parentStyle}>
            {qr &&
                <>
                    <Text style={styles.tip}>Show Your Personal QR to the Host</Text>
                    <View style={styles.mainContainer}>
                        <Image source={require('../../assets/qrBorderBlue.png')} style={styles.image} />

                        <QRCode
                            value={qr}
                            size={160}
                            color='black'
                            backgroundColor='white'
                        />
                    </View>
                </>
            }
            <View style={styles.lowerContainer}>
                <BlueButton title={myLoyaltyCards} onPress={showMyLoyaltyCards} />
            </View>
        </View>
    );
}

const borderSize = 270;

const styles = StyleSheet.create({
    tip: {
        color: 'black',
        flex: 0.5,
        textAlignVertical: 'center',
        fontSize: 18,
        fontWeight: '500'
    },
    image: {
        position: 'absolute',
        width: borderSize,
        height: borderSize,
    },
    mainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
    },
    lowerContainer: {
        flex: 1,
        width: '100%',
    },
    parentStyle: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default QRScreen;
