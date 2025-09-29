import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SearchBar } from '../component/searchBar';
import { useFocusEffect } from '@react-navigation/native';
import { getDBConnection, getSales, clearSales } from '../../database';

type GroupedSale = {
  id: number;
  name: string;
  quantity: number;
  totalPrice: number;
};

export const Sales = () => {
  const [sales, setSales] = useState<GroupedSale[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  // ✅ filter the grouped sales by the search text
  const filteredSales = sales.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const loadSales = useCallback(async () => {
    const db = await getDBConnection();
    const data = await getSales(db);

    const grouped: Record<string, GroupedSale> = {};
    data.forEach(item => {
      if (!grouped[item.name]) {
        grouped[item.name] = {
          id: item.id,
          name: item.name,
          quantity: 1,
          totalPrice: item.price,
        };
      } else {
        grouped[item.name].quantity += 1;
        grouped[item.name].totalPrice += item.price;
      }
    });

    const groupedArr = Object.values(grouped);
    setSales(groupedArr);
    setTotal(groupedArr.reduce((sum, s) => sum + s.totalPrice, 0));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSales();
    }, [loadSales]),
  );

  const handleReset = async () => {
    Alert.alert(
      'Confirm Reset',
      'This will delete all sales records. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const db = await getDBConnection();
            await clearSales(db);
            setSales([]);
            setTotal(0);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* ✅ working search bar */}
      <SearchBar value={search} onChangeText={setSearch} />

      <FlatList
        style={{ flex: 1, paddingHorizontal: 4 }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={filteredSales}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.itemName}>
              {item.name} x{item.quantity}
            </Text>
            <Text style={styles.itemPrice}>₱{item.totalPrice}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.flexAlign}>
            <Text>No sales yet.</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total Sales: ₱{total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={{ fontSize: 16, color: '#fff' }}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F9FBEF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 8,
    borderRadius: 7,
  },
  total: { fontSize: 20, fontWeight: 'bold' },
  itemName: { fontSize: 20 },
  itemPrice: { fontSize: 16 },
  resetButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#B79600',
    borderRadius: 7,
  },
  footer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexAlign: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
