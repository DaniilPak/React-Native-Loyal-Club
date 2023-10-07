import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
Octicons.loadFont();

interface EmptyListMessageProps {
  title: string;
}

export default function EmptyListMessage({ title }: EmptyListMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    color: 'gray',
  },
});
