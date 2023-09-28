import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

const HalfScreenButtonsContainer = (props: any) => {
  return <View style={styles.container}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

export default HalfScreenButtonsContainer;
