import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import BlueButton from '../components/BlueButton';
import DeletableObject from '../components/DeletableObject';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Con from '../constants';
import { getArrayFromLocalStorage } from '../utils/async';
import { deleteWorkerFromBusiness, getWorkersByBid } from '../utils/api';
import { FlatList } from 'react-native-gesture-handler';

interface ManageWorkersProps {
  navigation: any;
  route: any;
}

function ManageWorkers({ route, navigation }: ManageWorkersProps) {
  const [userData, setUserData] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [jwtToken, setjwtToken] = useState('');

  const addWorker = () => {
    navigation.navigate('AddWorkerScanner');
  };

  const deleteWorker = (workerId: string) => {
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
            confirmDeleteWorker(workerId, userData.business);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const confirmDeleteWorker = (workerId: string, businessId: string) => {
    Con.DEBUG && console.log('Worker id ', workerId, 'businessId ', businessId);

    deleteWorkerFromBusiness(workerId, businessId, jwtToken)
      .then((onDelete) => {
        Con.DEBUG && console.log('Worker deleted succesfully ', onDelete);
      })
      .finally(() => navigation.replace('ManageWorkers'))
      .catch((err) => {
        Con.DEBUG && console.log('Cant delete worker', err);
      });
  };

  const init = () => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        Con.DEBUG && console.log('Got async data ', asyncdata);
        setUserData(asyncdata.userData);
        setjwtToken(asyncdata.token);

        const businessId = asyncdata.userData.business;
        getWorkersByBid(businessId)
          .then((workers) => {
            Con.DEBUG && console.log('Got workers', workers);
            setWorkers(workers);
          })
          .catch((err) => Con.DEBUG && console.log(err));
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);
      });
  };

  useEffect(() => {
    init();
  }, []);

  const rowIconSize = 20;
  const white = 'white';
  const addIcon = <Ionicons name="person-add" size={rowIconSize} color={white} />;

  const renderItem = function ({ item }: any) {
    return (
      <DeletableObject text={`${item.name} ${item.surname} (${item.type})`} onDelete={() => deleteWorker(item._id)} />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <BlueButton title="Добавить сотрудника" onPress={addWorker} icon={addIcon} />

      {workers.length > 0 && (
        <View style={{ marginTop: 15 }}>
          <FlatList data={workers} renderItem={renderItem} keyExtractor={(item) => item._id} />
        </View>
      )}
    </View>
  );
}

export default ManageWorkers;
