import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SearchBar } from '../component/searchBar';
import { useFocusEffect } from '@react-navigation/native';
import {
  getDBConnection,
  getSales,
  clearSales,
  getProducts,
  updateProduct,
  insertSale,
} from '../../database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/sales';
import { EmptyScreenComponent } from '../component/emptyListComponent';

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

  // ✅ Filter the grouped sales by the search text
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

  // 🆕 Open modal with current item
  const handleEditQuantity = (item: GroupedSale) => {
    setSelectedSale(item);
    setTempQuantity(item.quantity);
    setModalVisible(true);
  };

  // 🆕 Confirm changes
  const confirmQuantityChange = async () => {
    if (!selectedSale) return;

    try {
      const db = await getDBConnection();

      // find product in inventory
      const products = await getProducts(db);
      const product = products.find(p => p.name === selectedSale.name);
      if (!product) {
        Alert.alert('Error', 'Product not found in inventory.');
        return;
      }

      const oldQty = selectedSale.quantity;
      const newQty = tempQuantity;
      const diff = oldQty - newQty; // positive => we removed items from sale (return to inventory)

      // DECREASED: return items to inventory and delete corresponding sale rows
      if (diff > 0) {
        // update inventory: add back diff
        await updateProduct(db, {
          ...product,
          quantity: product.quantity + diff,
        });

        // delete `diff` rows from sales table for this product (remove newest entries)
        const selectRes = await db.executeSql(
          'SELECT id FROM sales WHERE name = ? ORDER BY id DESC LIMIT ?',
          [product.name, diff],
        );

        // ✅ universal SQLite row extraction
        const rowsArray: any[] = [];
        const rows = selectRes[0].rows;
        for (let i = 0; i < rows.length; i++) {
          rowsArray.push(rows.item(i));
        }

        const ids = rowsArray.map(r => r.id);
        if (ids.length > 0) {
          const placeholders = ids.map(() => '?').join(',');
          await db.executeSql(
            `DELETE FROM sales WHERE id IN (${placeholders})`,
            ids,
          );
        }
      }

      // INCREASED: add more sales (if stock available) and decrease inventory
      else if (diff < 0) {
        const increase = -diff;
        if (product.quantity < increase) {
          Alert.alert(
            'Not enough stock',
            `Only ${product.quantity} left in inventory, cannot add ${increase}.`,
          );
          return;
        }

        // reduce inventory
        await updateProduct(db, {
          ...product,
          quantity: product.quantity - increase,
        });

        // insert extra sale rows
        for (let i = 0; i < increase; i++) {
          await insertSale(db, product);
        }
      }

      // reload from DB so groupings/totals are consistent and persistent
      await loadSales();

      // Close modal & reset
      setModalVisible(false);
      setSelectedSale(null);
      setTempQuantity(1);
    } catch (error) {
      console.error('Error updating sale quantity:', error);
      Alert.alert('Error', 'Failed to update sale. See console for details.');
    }
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
          keyExtractor={item => item.name} // ✅ use name to avoid duplicate keys
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <View style={styles.flexContainer}>
                <View>
                  <View style={styles.TextContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>

                  <View style={styles.descriptionSales}>
                    <View style={styles.totalQuantityContainer}>
                      <Text>Total Quantity:</Text>
                      <Text style={styles.textSales}>{item.quantity}</Text>
                    </View>
                    <View style={styles.totalPrizeContainer}>
                      <Text>Total Prize:</Text>
                      <Text style={styles.textSales}>₱{item.totalPrice}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.editButton}>
                  <TouchableOpacity onPress={() => handleEditQuantity(item)}>
                    <Ionicons name="create-outline" size={24} color="skyblue" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.flexAlign}>
              <EmptyScreenComponent
                tab="Sales"
                icon={
                  <Image
                    source={require('../assets/images/EmptyLogo.png')}
                    style={{ width: 150, height: 150 }}
                  />
                }
              />
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

      {/* 🆕 Modal for editing quantity */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedSale(null);
          setTempQuantity(1);
        }}
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
                onPress={() => {
                  setModalVisible(false);
                  setSelectedSale(null);
                  setTempQuantity(1);
                }}
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
