import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch, FlatList, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Con from '../constants';
import TextBlock from '../components/TextBlock';
import TextMultiBlock from '../components/TextMultiBlock';
import BlueButton from '../components/BlueButton';
import { ScrollView } from 'react-native-gesture-handler';
import TextBlockV2 from '../components/TextBlockV2';
import { getArrayFromLocalStorage } from '../utils/async';
import { deleteAccountForever, getLoyaltyCardDetails } from '../utils/api';
import NavigationRow from '../components/NavigationRow';
import NavigationRowExtended from '../components/NavigationRowExtended';
import { AuthContext } from '../contexts/AuthContext';
import { showMessage } from 'react-native-flash-message';

interface AccountDeletionScreenProps {
    navigation: any;
    route: any;
}

function AccountDeletion({ route, navigation }: AccountDeletionScreenProps) {

    const { signOut } = useContext(AuthContext);
    const [asyncData, setAsyncData] = useState([]);

    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                Con.DEBUG && console.log("asyncdata", asyncdata);
                setAsyncData(asyncdata);
            })
            .catch(err => {
                Con.DEBUG && console.log(err);

                showMessage({
                    message: "Can't get localstorage data",
                    description: "",
                    type: "warning",
                });
            });
    }, []);

    const deleteAccount = () => {
        Alert.alert(
            'Info',
            'Warning: Deleting your account will result in permanent loss of all your data, all your loyalty cards will be wiped.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'I understand',
                    style: 'destructive',
                    onPress: () => {
                        // Handle delete logic here
                        Alert.alert(
                            'Confirmation',
                            'Are you sure you want to delete this account?',
                            [
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Delete account',
                                    style: 'destructive',
                                    onPress: () => {
                                        // Delete account here
                                        console.log("asyncData.userData", asyncData.userData, "asyncData.token", asyncData.token);

                                        deleteAccountForever(asyncData.userData._id, asyncData.token)
                                            .then(() => {
                                                console.log("Calling user complete");
                                                signOut();
                                            })
                                            .catch(err => {
                                                console.log("Error", err);
                                            })
                                    },
                                },
                            ],
                            { cancelable: false }
                        );
                    },
                },
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={{ flex: 1, marginTop: 10 }}>
            <BlueButton title='Delete Account' onPress={deleteAccount} />
        </View>
    );
}

export default AccountDeletion;