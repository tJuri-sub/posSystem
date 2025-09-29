import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SearchBar } from '../component/searchBar';
import { useFocusEffect } from '@react-navigation/native';
import { getDBConnection, getSales, clearSales } from '../../database';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState<GroupedSale | null>(null);
  const [tempQuantity, setTempQuantity] = useState(1);

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

  // 🆕 open modal with current item
  const handleEditQuantity = (item: GroupedSale) => {
    setSelectedSale(item);
    setTempQuantity(item.quantity);
    setModalVisible(true);
  };

  // 🆕 confirm changes
  const confirmQuantityChange = () => {
    if (!selectedSale) return;

    const updatedSales = sales.map(s => {
      if (s.id === selectedSale.id) {
        // adjust total price proportionally
        const unitPrice = s.totalPrice / s.quantity;
        return {
          ...s,
          quantity: tempQuantity,
          totalPrice: unitPrice * tempQuantity,
        };
      }
      return s;
    });

    setSales(updatedSales);
    setTotal(updatedSales.reduce((sum, s) => sum + s.totalPrice, 0));
    setModalVisible(false);
    setSelectedSale(null);
  };

  return (
    <View style={styles.container}>
      {/* ✅ working search bar */}
      <SearchBar value={search} onChangeText={setSearch} />

      <View style={styles.salesList}>
        <FlatList
          style={styles.listEntry}
          contentContainerStyle={{ flexGrow: 1 }}
          data={filteredSales}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.flexEntry}>
                <Text style={styles.itemName}>
                  {item.name} x{item.quantity}
                </Text>
                <TouchableOpacity onPress={() => handleEditQuantity(item)}>
                  <Ionicons name="create-outline" size={24} color="skyblue" />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemPrice}>₱{item.totalPrice}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.flexAlign}>
              <Text style={styles.emptyStyle}>No sales yet.</Text>
            </View>
          }
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.total}>Total Sales: ₱{total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={{ fontSize: 16, color: '#fff' }}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit Quantity - {selectedSale?.name}
            </Text>

            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setTempQuantity(q => Math.max(1, q - 1))}
              >
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>{tempQuantity}</Text>

              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setTempQuantity(q => q + 1)}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#aaa' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#B79600' }]}
                onPress={confirmQuantityChange}
              >
                <Text style={styles.modalBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    borderRadius: 7,
    borderWidth: 1,
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

  salesList: {
    flex: 1,
    width: '100%',

    marginTop: 10,
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

  emptyStyle: {
    fontSize: 16,
    textAlign: 'center',
  },

  listEntry: { flex: 1, paddingHorizontal: 4 },

  flexEntry: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B79600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: { fontSize: 24, color: '#fff' },
  quantityText: { fontSize: 20, marginHorizontal: 20 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalBtnText: { color: '#fff', fontSize: 16 },
});
