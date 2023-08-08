import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TextInput, Alert } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import GrayButton from '../components/GrayButton';
import { makeAnnouncement } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';

interface AnnouncementsProps {
    navigation: any;
    route: any;
}

function Announcements({ route, navigation }: AnnouncementsProps) {
    const [asyncdata, setAsyncdata] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const makeAnnounce = () => {
        handleOpenModal();
    }

    const handleInputValueChange = (title: string) => {
        setInputValue(title);
    };

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleSaveInputValue = () => {
        if (inputValue.trim().length < 1) {
            console.log('Input is empty');
            return;
        }

        Alert.alert(
            'Confirmation',
            'Are you sure you want make Announce? Every customer will receive that message',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes, im sure',
                    style: 'destructive',
                    onPress: () => {
                        confirmAnnounce();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const confirmAnnounce = async () => {
        console.log("Sending announcement", inputValue);
        const announcement = await makeAnnouncement(asyncdata.token, asyncdata.userData.business, inputValue);
        handleCloseModal();

        showMessage({
            message: "Announcement created successfully",
            description: `${announcement.peopleNotified} people notified.`,
            type: "success",
            duration: 5000,
        });
    }

    const initFunc = async () => {
        const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
        setAsyncdata(asyncdata);
    }

    useEffect(() => {
        initFunc();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <BlueButton title='Make Announce!' onPress={makeAnnounce} />

            <Modal visible={modalVisible} animationType='slide'>
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder="Body of the message"
                        onChangeText={handleInputValueChange}
                        value={inputValue}
                        multiline // Allow multiline input
                        numberOfLines={3} // Set the initial number of lines
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
        width: '100%', // Make the TextInput wider
        borderColor: 'gray',
        borderWidth: 1,
        color: 'black',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    }
});

export default Announcements;