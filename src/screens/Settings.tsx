import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Con from '../constants';
import { getArrayFromLocalStorage } from '../utils/async';
import TextBlock from '../components/TextBlock';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import NavigationRow from '../components/NavigationRow';
import GrayButton from '../components/GrayButton';
import { AuthContext } from '../contexts/AuthContext';

interface SettingsProps {
    navigation: any;
    route: any;
}

function Settings({ route, navigation }: SettingsProps) {
    const [userData, setUserData] = useState([]);

    const { signOut } = useContext(AuthContext);

    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                Con.DEBUG && console.log("async data settings", asyncdata.userData);
                setUserData(asyncdata.userData);
            })
            .catch(err => {
                Con.DEBUG && console.log(err);
            });
    }, [])

    const userTypeIcon = <Ionicons name="cog-outline" size={Con.iconSize} color={Con.iconColor} />
    const userNameIcon = <Ionicons name="person-circle-outline" size={Con.iconSize} color={Con.iconColor} />
    const phoneIcon = <Ionicons name="phone-portrait-sharp" size={Con.iconSize} color={Con.iconColor} />

    const businessSettingsOnPress = () => {
        navigation.navigate("BusinessSettings");
    }

    const accountDeletionOnPress = () => {
        navigation.navigate("AccountDeletion");
    }

    const signOutAlert = () => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete this worker?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign out',
                    style: 'destructive',
                    onPress: () => {
                        // Handle delete logic here
                        signOut();
                    },
                },
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {userData &&
                <View>
                    <TextBlock text={`Account type: ${userData.type}`} icon={userTypeIcon}></TextBlock>
                    <TextBlock text={`${userData.name} ${userData.surname}`} icon={userNameIcon}></TextBlock>
                    <TextBlock text={`${userData.phoneNumber}`} icon={phoneIcon}></TextBlock>
                    {/* Show settings only for business */}
                    {userData.type == 'Business' &&
                        <View style={styles.settingsContainer}>
                            <NavigationRow text='Business settings' onPress={businessSettingsOnPress} />
                        </View>
                    }
                    <NavigationRow text='Account deletion' onPress={accountDeletionOnPress} />
                    <GrayButton title='Quit' onPress={signOutAlert} />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    settingsContainer: {
        marginTop: 25,
    },
});

export default Settings;