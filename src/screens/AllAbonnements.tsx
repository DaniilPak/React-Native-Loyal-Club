import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import Con from '../constants';
import { getAllBusinessAbonnementsByBusinessId, getBusinessInfoByBid } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { timeLeftUntilDate } from '../utils/helper';
import EmptyListMessage from '../components/EmptyListMessage';
import Loading from './Loading';
import NavigationRowSuperExtended from '../components/NavigationRowSuperExtended';

interface AllAbonnementsProps {
  navigation: any;
  route: any;
}

const Tab = createMaterialTopTabNavigator();

function AllAbonnements({ route, navigation }: AllAbonnementsProps) {
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
  const [businessDetails, setBusinessDetails] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  /// Methods
  const renderAbonnementItem = ({ item }: any) => (
    <NavigationRowSuperExtended
      text={`${item.name} ${item.price} ${businessDetails.currencySign}`}
      secondaryText={`${item.value}/${item.totalValue} ${item.currency}`}
      thirdText={`до окончания: ${timeLeftUntilDate(item.endDate)}`}
      fourthText={`Создал: ${item.createdByUserIdDetails.name} ${item.createdByUserIdDetails.surname}`}
      fifthText={`Клиент: ${item.clientDetails.name} ${item.clientDetails.surname}`}
      onPress={() => {
        navigation.navigate('AbonnementCompleteInfo', { abonnementId: item._id });
      }}
    />
  );

  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      setAsyncdata(asyncdata);

      const businessId =
        asyncdata.userData.type === 'Business' ? asyncdata.userData.business : asyncdata.userData.workBusiness;
      const businessDetails = await getBusinessInfoByBid(businessId);
      setBusinessDetails(businessDetails);

      const abonnements = await getAllBusinessAbonnementsByBusinessId(businessDetails._id);
      console.log('Abonnements: ', abonnements);

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
  const [businessDetails, setBusinessDetails] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const renderAbonnementItem = ({ item }: any) => (
    <NavigationRowSuperExtended
      text={`${item.name} ${item.price} ${businessDetails.currencySign}`}
      secondaryText={`${item.value}/${item.totalValue} ${item.currency}`}
      thirdText={`до окончания: ${timeLeftUntilDate(item.endDate)}`}
      fourthText={`Создал: ${item.createdByUserIdDetails.name} ${item.createdByUserIdDetails.surname}`}
      fifthText={`Клиент: ${item.clientDetails.name} ${item.clientDetails.surname}`}
      onPress={() => {
        navigation.navigate('AbonnementCompleteInfo', { abonnementId: item._id });
      }}
    />
  );

  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      setAsyncdata(asyncdata);

      const businessId =
        asyncdata.userData.type === 'Business' ? asyncdata.userData.business : asyncdata.userData.workBusiness;
      const businessDetails = await getBusinessInfoByBid(businessId);
      setBusinessDetails(businessDetails);

      const abonnements = await getAllBusinessAbonnementsByBusinessId(businessDetails._id);
      console.log('Abonnements: ', abonnements);

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

export default AllAbonnements;
