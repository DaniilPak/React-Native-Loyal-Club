import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Con from '../constants';
import { getArrayFromLocalStorage } from '../utils/async';
import TextBlock from '../components/TextBlock';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationRow from '../components/NavigationRow';

interface SettingsProps {
    navigation: any;
    route: any;
}

function Settings({ route, navigation }: SettingsProps) {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                console.log("async data settings", asyncdata.userData);
                setUserData(asyncdata.userData);
            })
            .catch(err => {
                console.log(err);
            });
    }, [])

    const userTypeIcon = <Ionicons name="cog-outline" size={Con.iconSize} color={Con.iconColor} />
    const userNameIcon = <Ionicons name="person-circle-outline" size={Con.iconSize} color={Con.iconColor} />
    const phoneIcon = <Ionicons name="phone-portrait-sharp" size={Con.iconSize} color={Con.iconColor} />

    const businessSettingsOnPress = () => {
        navigation.navigate("BusinessSettings");
    }

    return (
        <View style={{ flex: 1 }}>
            {userData &&
                <View>
                    <TextBlock text={`Account type: ${userData.type}`} icon={userTypeIcon}></TextBlock>
                    <TextBlock text={`${userData.name} ${userData.surname}`} icon={userNameIcon}></TextBlock>
                    <TextBlock text={`${userData.phoneNumber}`} icon={phoneIcon}></TextBlock>
                    <View style={styles.settingsContainer}>
                        <NavigationRow text='Business settings' onPress={businessSettingsOnPress} />
                    </View>
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