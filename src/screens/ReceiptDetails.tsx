import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getDetailedReceipt } from '../utils/api';
import TextBlockV2 from '../components/TextBlockV2';
import Con from '../constants';

import moment from 'moment';

interface ReceiptDetailsProps {
  navigation: any;
  route: any;
}

function ReceiptDetails({ route }: ReceiptDetailsProps) {
  const { _receiptId, businessId } = route.params;
  const [detailedReceipt, setDetailedReceipt] = useState([]);
  const [businessObject, setBusinessObject] = useState([]);
  const [allSet, setAllSet] = useState(false);

  useEffect(() => {
    Con.DEBUG && console.log('Receipt details init ', _receiptId, 'businessId: ', businessId);

    getDetailedReceipt(_receiptId)
      .then((detailedReceipt) => {
        Con.DEBUG && console.log('Got detailed receipt', detailedReceipt);
        setDetailedReceipt(detailedReceipt);
      })
      .finally(() => setAllSet(true))
      .catch((err) => {
        Con.DEBUG && console.log(err);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {allSet && (
        <View>
          <TextBlockV2 text={`Клиент: ${detailedReceipt.receiptObject.clientNameSurname}`} />
          <TextBlockV2 text={`Телефон клиента: ${detailedReceipt.receiptObject.clientPhone}`} />
          <TextBlockV2 text={`Сотрудник: ${detailedReceipt.receiptObject.workerNameSurname}`} />

          <TextBlockV2
            text={`Дата покупки: ${moment(detailedReceipt.receiptObject.purchaseDate).format('DD.MM.YYYY HH:mm')}`}
          />
          <TextBlockV2
            text={`Сумма чека: ${detailedReceipt.receiptObject.inputDigitMoneyValue} ${detailedReceipt.receiptObject.currencySign}`}
          />
          <TextBlockV2
            text={`Оплачено бонусами: ${detailedReceipt.receiptObject.minusBonus} ${detailedReceipt.receiptObject.currencySign}`}
          />
          <TextBlockV2
            text={`Итого оплачено: ${detailedReceipt.receiptObject.purchaseAmount} ${detailedReceipt.receiptObject.currencySign}`}
          />
          <TextBlockV2
            text={`Выписано бонусов: ${detailedReceipt.receiptObject.bonusAmount} ${detailedReceipt.receiptObject.currencySign}`}
          />
        </View>
      )}
      {!allSet && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Con.AppleBlueLight} />
        </View>
      )}
    </View>
  );
}

export default ReceiptDetails;
