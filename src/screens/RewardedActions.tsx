import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Linking } from 'react-native';
import Loading from './Loading';
import EmptyListMessage from '../components/EmptyListMessage';
import ShrinkableContainer from '../components/ShrinkableContainer';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import { executeRewardAction, getRewardedActionsByUserId } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';

interface RewardedActionsProps {
  navigation: any;
  route: any;
}

function RewardedActions({ route, navigation }: RewardedActionsProps) {
  const emptyTitle = 'Нет предложений';

  const [isLoading, setIsLoading] = useState(true);

  const [rewardedActions, setRewardedActions] = useState([]);

  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      const currentUserId = asyncdata.userData._id;

      const fetchedRewardedActions = await getRewardedActionsByUserId(currentUserId);
      console.log('fetchedRewardedActions', fetchedRewardedActions);
      setRewardedActions(fetchedRewardedActions);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const goToLink = (url: any, rewardedActionId: any) => {
    // Open the link
    Linking.openURL(url)
      .then(() => executeRewardAction(rewardedActionId))
      .catch((err) =>
        showMessage({
          message: 'Ошибка',
          description: 'Не удалось применить анонимный ваучер',
          type: 'warning',
        })
      );
  };

  const renderAbonnementItem = ({ item }: any) => (
    <ShrinkableContainer>
      <View style={styles.rewardedActionsContainer}>
        <View style={{ flex: 0.5 }}>
          <Text style={styles.buttonText}>{item.promotionTitle}</Text>
        </View>
        <View style={{ flex: 0.5 }}>
          <BlueButton title={item.actionName} onPress={() => goToLink(item.actionLink, item._id)} />
        </View>
      </View>
    </ShrinkableContainer>
  );

  useEffect(() => {
    initFunc();
  }, []);

  if (!isLoading) {
    return (
      <FlatList
        data={rewardedActions}
        keyExtractor={(item) => item._id}
        renderItem={renderAbonnementItem}
        ListEmptyComponent={<EmptyListMessage title={emptyTitle} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  } else {
    return <Loading />;
  }
}

const styles = StyleSheet.create({
  rewardedActionsContainer: {
    marginTop: 20,

    alignSelf: 'center',

    width: Con.width * 0.9,
    height: Con.width * 0.9 * 0.5,
    backgroundColor: 'white',
    borderRadius: Con.universalBorderRadius,

    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.01,
    shadowRadius: 1,
    elevation: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    padding: 20,
  },
});

export default RewardedActions;
