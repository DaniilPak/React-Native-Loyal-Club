import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import BlueButton from '../components/BlueButton';
import DeletableObject from '../components/DeletableObject';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Con from '../constants';

interface ManageWorkersProps {
    navigation: any;
    route: any;
}

function ManageWorkers({ route, navigation }: ManageWorkersProps) {

    const addWorker = () => {
        navigation.navigate("AddWorkerScanner");
    }

    const deleteWorker = () => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete this worker?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // Handle delete logic here
                        console.log('worker deleted');
                        confirmDeleteWorker();
                    },
                },
            ],
            { cancelable: false }
        );
    }

    const confirmDeleteWorker = () => {

    }

    const rowIconSize = 20;
    const white = 'white';
    const addIcon = <Ionicons name="person-add" size={rowIconSize} color={white} />

    return (
        <View style={{ flex: 1 }}>
            <BlueButton title='Add Worker' onPress={addWorker} icon={addIcon} />

            <View style={{ marginTop: 15 }}>
                <DeletableObject text='Worker name' onDelete={deleteWorker} />
            </View>
        </View>
    );
}

export default ManageWorkers;