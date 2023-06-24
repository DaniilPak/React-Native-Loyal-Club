import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch, FlatList } from 'react-native';
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
import { getLoyaltyCardDetails } from '../utils/api';
import NavigationRow from '../components/NavigationRow';
import NavigationRowExtended from '../components/NavigationRowExtended';

interface BusinessSettingsScreenProps {
    navigation: any;
    route: any;
}

function BusinessSettings({ route, navigation }: BusinessSettingsScreenProps) {
    // 1. Implement Add Worker by QR code
    // 2. Manage workers (delete)
    // 3. Change Loyalty Percent

    const manageWorkersOnPress = () => {
        navigation.navigate("ManageWorkers");
    }

    const loyaltyPercentOnPress = () => {
        navigation.navigate("LoyaltyPercent");
    }

    return (
        <View style={{ flex: 1, marginTop: 10 }}>
            <NavigationRow text='Manage Workers' onPress={manageWorkersOnPress} />
            <NavigationRowExtended text='Loyalty Percent' secondaryText='3%' onPress={loyaltyPercentOnPress} />
        </View>
    );
}

export default BusinessSettings;