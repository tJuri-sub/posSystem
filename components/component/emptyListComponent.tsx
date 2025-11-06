import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyScreenProps {
  tab?: string;
  message?: string;
  icon?: React.ReactNode; // optional custom logo/icon
}

export const EmptyScreenComponent: React.FC<EmptyScreenProps> = ({
  tab = 'Home',
  message,
  icon,
}) => {
  const text =
    message ??
    (tab === 'Sales'
      ? 'Sales for today is empty.'
      : tab === 'Home'
      ? 'Products are empty.'
      : tab?.toLowerCase() === 'inventory'
      ? 'Inventory is empty.'
      : 'No items found.');

  return (
    <View style={styles.container}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrap: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
  },
});
