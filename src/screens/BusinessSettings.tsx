import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch, FlatList } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Con from '../constants';
import TextBlock from '../components/TextBlock';
import TextMultiBlock from '../components/TextMultiBlock';
import BlueButton from '../components/BlueButton';
import { ScrollView } from 'react-native-gesture-handler';
import TextBlockV2 from '../components/TextBlockV2';
import { getArrayFromLocalStorage } from '../utils/async';
import { getLoyaltyCardDetails } from '../utils/api';

interface BusinessSettingsScreenProps {
    navigation: any;
    route: any;
}

function BusinessSettings({ route, navigation }: BusinessSettingsScreenProps) {

    return (
        <View style={{ flex: 1 }}>
        </View>
    );
}

export default BusinessSettings;