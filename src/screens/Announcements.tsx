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
  };

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
      'Подтвердите действие',
      'Вы уверены, что хотите сделать объявление? Каждый клиент получит это сообщение',
      [
        {
          text: 'Не уверен',
          style: 'cancel',
        },
        {
          text: 'Да, я уверен',
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
    console.log('Sending announcement', inputValue);
    const announcement = await makeAnnouncement(asyncdata.token, asyncdata.userData.business, inputValue);
    handleCloseModal();

    showMessage({
      message: 'Уведомления отправлены успешно!',
      description: `${announcement.peopleNotified} people notified.`,
      type: 'success',
      duration: 5000,
    });
  };

  const initFunc = async () => {
    const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
    setAsyncdata(asyncdata);
  };

  useEffect(() => {
    initFunc();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <BlueButton title="Сделать анонс" onPress={makeAnnounce} />

      <Modal visible={modalVisible} animationType="slide">
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
            <GrayButton title="Отменить" onPress={handleCloseModal} />
            <BlueButton title="Создать" onPress={handleSaveInputValue} />
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
    marginTop: 75,
  },
});

export default Announcements;
