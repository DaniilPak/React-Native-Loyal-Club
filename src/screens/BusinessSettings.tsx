import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import { getArrayFromLocalStorage } from '../utils/async';
import { getBusinessInfoByBid, updateBusinessLoyaltyPercent } from '../utils/api';
import NavigationRow from '../components/NavigationRow';
import NavigationRowExtended from '../components/NavigationRowExtended';
import GrayButton from '../components/GrayButton';
import { showMessage } from 'react-native-flash-message';

interface BusinessSettingsScreenProps {
    navigation: any;
    route: any;
}

function BusinessSettings({ route, navigation }: BusinessSettingsScreenProps) {
    // 1. Implement Add Worker by QR code
    // 2. Manage workers (delete)
    // 3. Change Loyalty Percent

    const [userData, setUserData] = useState([]);
    const [businessDetails, setBusinessDetails] = useState([]);

    const manageWorkersOnPress = () => {
        navigation.navigate("ManageWorkers");
    }

    const loyaltyPercentOnPress = () => {
        handleOpenModal();
    }

    /// Loyalty percent edit 
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleInputValueChange = (percent: any) => {
        setInputValue(percent);
    };

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleSaveInputValue = () => {
        // Handle the entered number here, e.g., perform some action with the value
        // For demonstration purposes, we will just display it in an alert
        const numberValue = parseInt(inputValue);

        if (!isNaN(numberValue)) {
            setInputValue('');
            handleCloseModal();

            Con.DEBUG && console.log(userData.token, numberValue, userData.userData.business);

            updateBusinessLoyaltyPercent(userData.token, numberValue, userData.userData.business)
                .then(() => {
                    showMessage({
                        message: `Loyalty percent successfully updated to ${numberValue}%`,
                        description: "Let's continue work!",
                        type: "success",
                    });
                })
                .catch(err => {
                    showMessage({
                        message: "Failed to update loyalty percent",
                        description: "please check that percent is correct",
                        type: "danger",
                    });
                });
        }
    };

    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                setUserData(asyncdata);
                Con.DEBUG && console.log("ASync data: ", asyncdata);

                // Get business 
                getBusinessInfoByBid(asyncdata.userData.business)
                    .then(businessDetails => setBusinessDetails(businessDetails))
                    .catch(err => { });
            })
            .catch(err => {
                Con.DEBUG && console.log(err);
            });
    }, []);

    return (
        <View style={{ flex: 1, marginTop: 10 }}>
            <NavigationRow text='Manage Workers' onPress={manageWorkersOnPress} />
            {businessDetails && <NavigationRowExtended text='Loyalty Percent' secondaryText={`${businessDetails.loyalPercent} %`} onPress={loyaltyPercentOnPress} />}

            <Modal visible={modalVisible} animationType='slide'>
                <View style={styles.modalContainer}>
                    <TextInputMask
                        type="only-numbers"
                        autoFocus={true}
                        value={inputValue} // Pass your input value here
                        onChangeText={percent => handleInputValueChange(percent)} // Handle the input change
                        keyboardType="numeric" // Set the keyboard type to numeric
                        placeholder='Enter loyalty percent'
                        placeholderTextColor={'gray'}
                        style={styles.input}
                    />
                    <View style={{ marginTop: 10 }}>
                        <GrayButton title='Cancel' onPress={handleCloseModal} />
                        <BlueButton title='Save' onPress={handleSaveInputValue} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        textAlign: 'center',
        color: 'black',
        marginTop: 25,
        fontSize: 30
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    }
});

export default BusinessSettings;