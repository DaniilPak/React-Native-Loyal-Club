import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import Con from '../constants';
import { getAbonnementsByUserId } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NavigationRowSuperExtended from '../components/NavigationRowSuperExtended';
import { timeLeftUntilDate } from '../utils/helper';
import Loading from './Loading';
import EmptyListMessage from '../components/EmptyListMessage';

interface UserAbonnementsProps {
  navigation: any;
  route: any;
}

const Tab = createMaterialTopTabNavigator();

function UserAbonnements({ route, navigation }: UserAbonnementsProps) {
  return (
    <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
      <Tab.Screen
        name="ActiveAbonnements"
        component={ActiveAbonnements}
        initialParams={{ navigation: navigation }}
        options={{ title: 'Активные' }}
      />
      <Tab.Screen
        name="InactiveAbonnements"
        component={InactiveAbonnements}
        initialParams={{ navigation: navigation }}
        options={{ title: 'Неактивные' }}
      />
    </Tab.Navigator>
  );
}

interface ActiveAbonnementsProps {
  route: any;
}

function ActiveAbonnements({ route }: ActiveAbonnementsProps) {
  const { navigation } = route.params;

  const [asyncdata, setAsyncdata] = useState([]);
  const [activeAbonnements, setActiveAbonnements] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  /// Methods
  function renderAbonnementItem({ item }: any) {
    return (
      <NavigationRowSuperExtended
        text={`${item.businessDetails.name} - абонемент`}
        secondaryText={`${item.value}/${item.totalValue} ${item.currency}`}
        thirdText={`до окончания: ${timeLeftUntilDate(item.endDate)}`}
        fourthText={`Название: ${item.name}`}
        fifthText={`Цена: ${item.price} ${item.businessDetails.currencySign}`}
        onPress={() => {
          navigation.navigate('AbonnementCompleteInfo', { abonnementId: item._id });
        }}
      />
    );
  }

  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      setAsyncdata(asyncdata);

      const abonnements = await getAbonnementsByUserId(asyncdata.userData._id);
      const activeAbonnements = abonnements.filter((abon: any) => abon.isActive === true);
      activeAbonnements.sort((a: any, b: any) => b.lastUpdatedTimestamp - a.lastUpdatedTimestamp);

      setActiveAbonnements(activeAbonnements);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initFunc();
  }, []);

  if (!isLoading) {
    return (
      <FlatList
        data={activeAbonnements}
        keyExtractor={(item) => item._id}
        renderItem={renderAbonnementItem}
        ListEmptyComponent={<EmptyListMessage title="Нет активных абонементов" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  } else {
    return <Loading />;
  }
}

interface InactiveAbonnementsProps {
  route: any;
}

function InactiveAbonnements({ route }: InactiveAbonnementsProps) {
  const { navigation } = route.params;

  const [asyncdata, setAsyncdata] = useState([]);
  const [inactiveAbonnements, setInctiveAbonnements] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  function renderAbonnementItem({ item }: any) {
    return (
      <NavigationRowSuperExtended
        text={`${item.businessDetails.name} - абонемент`}
        secondaryText={`${item.value}/${item.totalValue} ${item.currency}`}
        thirdText={`до окончания: ${timeLeftUntilDate(item.endDate)}`}
        fourthText={`Название: ${item.name}`}
        fifthText={`Цена: ${item.price} ${item.businessDetails.currencySign}`}
        onPress={() => {
          navigation.navigate('AbonnementCompleteInfo', { abonnementId: item._id });
        }}
      />
    );
  }

  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      setAsyncdata(asyncdata);

      const abonnements = await getAbonnementsByUserId(asyncdata.userData._id);
      const inactiveAbonnements = abonnements.filter((abon: any) => abon.isActive === false);
      inactiveAbonnements.sort((a: any, b: any) => b.lastUpdatedTimestamp - a.lastUpdatedTimestamp);

      setInctiveAbonnements(inactiveAbonnements);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initFunc();
  }, []);

  if (!isLoading) {
    return (
      <FlatList
        data={inactiveAbonnements}
        keyExtractor={(item) => item._id}
        renderItem={renderAbonnementItem}
        ListEmptyComponent={<EmptyListMessage title="Нет неактивных абонементов" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  } else {
    return <Loading />;
  }
}

export default UserAbonnements;
