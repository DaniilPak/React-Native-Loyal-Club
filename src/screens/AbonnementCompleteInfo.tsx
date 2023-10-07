import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { getAbonnementCompleteInfo, getAbonnementVisits } from '../utils/api';
import TextBlockV2 from '../components/TextBlockV2';
import { formatToClassicDateStyleWithTime } from '../utils/helper';
import Loading from './Loading';
import { Text } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import EmptyListMessage from '../components/EmptyListMessage';

interface AbonnementCompleteInfoProps {
  navigation: any;
  route: any;
}

function AbonnementCompleteInfo({ route, navigation }: AbonnementCompleteInfoProps) {
  const { abonnementId } = route.params;

  const [isLoading, setIsLoading] = useState(true);

  const [abonnement, setAbonnement] = useState([]);
  const [abonnementVisits, setAbonnementVisits] = useState([]);

  const initFunc = async () => {
    try {
      const abonnement = await getAbonnementCompleteInfo(abonnementId);
      setAbonnement(abonnement);

      const visits = await getAbonnementVisits(abonnementId);
      setAbonnementVisits(visits);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAbonnementItem = ({ item }: any) => (
    <TextBlockV2 text={`${item.value} ${abonnement.currency} ${formatToClassicDateStyleWithTime(item.visitDate)}`} />
  );

  useEffect(() => {
    initFunc();
  }, []);

  if (!isLoading) {
    return (
      <FlatList
        data={abonnementVisits}
        keyExtractor={(item) => item._id}
        renderItem={renderAbonnementItem}
        ListEmptyComponent={<EmptyListMessage title="Нет визитов" />}
        ListHeaderComponent={
          <View>
            <TextBlockV2 text={`Эмитент: ${abonnement.businessDetails.name}`} />
            <TextBlockV2 text={`Держатель: ${abonnement.clientDetails.name} ${abonnement.clientDetails.surname}`} />
            <TextBlockV2
              text={`Создал: ${abonnement.createdByUserIdDetails.name} ${abonnement.createdByUserIdDetails.surname}`}
            />
            <TextBlockV2 text={`Статус: ${abonnement.isActive ? 'Активен' : 'Истек'}`} />
            <TextBlockV2 text={`Осталось (${abonnement.currency}): ${abonnement.value}/${abonnement.totalValue}`} />

            <TextBlockV2
              text={`Последний визит: ${formatToClassicDateStyleWithTime(abonnement.lastUpdatedTimestamp)}`}
            />
            <TextBlockV2 text={`Начало действия: ${formatToClassicDateStyleWithTime(abonnement.startDate)}`} />
            <TextBlockV2 text={`Конец действия: ${formatToClassicDateStyleWithTime(abonnement.endDate)}`} />

            <Text variant="headlineMedium" style={{ padding: 15 }}>
              Визиты
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  } else {
    return <Loading />;
  }
}

export default AbonnementCompleteInfo;
