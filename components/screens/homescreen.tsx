import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import styles from '../../components/styles/homescreen';

import { SearchBar } from '../component/searchBar';
import { AlertBox } from '../component/customAlert';

import {
  getDBConnection,
  createTables,
  createSalesTable,
  getProducts,
  insertSale,
  updateProduct,
  Product,
} from '../../database';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { EmptyScreenComponent } from '../component/emptyListComponent';

export const Homescreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const alertTimeoutRef = React.useRef<number | null>(null);

  // modal state
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);

  const increase = (id: number) =>
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }));

  const decrease = (id: number) =>
    setQuantities(prev => {
      const current = prev[id] || 1;
      return { ...prev, [id]: current > 1 ? current - 1 : 1 };
    });

  const changeDirect = (id: number, text: string) =>
    setQuantities(prev => {
      const num = parseInt(text, 10) || 1;
      return { ...prev, [id]: num > 0 ? num : 1 };
    });

  const loadProducts = useCallback(async () => {
    const db = await getDBConnection();
    await createTables(db);
    const data = await getProducts(db);
    setProducts(data);
  }, []);

  useEffect(() => {
    (async () => {
      const db = await getDBConnection();
      await createTables(db);
      await createSalesTable(db); // ✅ ensure sales table exists
      await loadProducts();
    })();
  }, [loadProducts]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  // open confirm modal (no DB work here)
  const handleAddToCart = useCallback(
    (product: Product) => {
      const q = quantities[product.id] || 1;
      if (product.quantity < q) {
        Alert.alert(
          'Not enough stock',
          `Only ${product.quantity} left in stock.`,
        );
        return;
      }
      setModalProduct(product);
      setModalQuantity(q);
      setConfirmationModal(true);
    },
    [quantities],
  );

  // confirm -> perform DB updates
  const confirmAddToCart = useCallback(async () => {
    if (!modalProduct) return;
    try {
      const db = await getDBConnection();
      const updatedProduct = {
        ...modalProduct,
        quantity: modalProduct.quantity - modalQuantity,
      };
      await updateProduct(db, updatedProduct);
      for (let i = 0; i < modalQuantity; i++) {
        await insertSale(db, modalProduct);
      }
      setQuantities(prev => ({ ...prev, [modalProduct.id]: 1 }));
      await loadProducts();
      setConfirmationModal(false);
      setModalProduct(null);

      const msg = `${modalQuantity} x ${modalProduct.name} added to sales list!`;
      setAlertMessage(msg);
      setShowAlert(true);
      // clear previous timeout if any
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
      // hide after 5 seconds
      alertTimeoutRef.current = setTimeout(() => {
        setShowAlert(false);
        alertTimeoutRef.current = null;
      }, 5000) as unknown as number;
    } catch (error) {
      Alert.alert('Error', 'Failed to update product.');
      setConfirmationModal(false);
    }
  }, [modalProduct, modalQuantity, loadProducts]);

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} />

      <View style={styles.productList}>
        <FlatList
          style={styles.listEntry}
          contentContainerStyle={{ flexGrow: 1 }}
          data={filteredProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            const q = quantities[item.id] || 1; // ✅ move it here

            return (
              <View style={styles.Entry}>
                <View>
                  <View style={styles.TextContainer}>
                    <Text
                      style={styles.itemName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.entryBottomPart}>
                    <View style={styles.descriptionPrice}>
                      <Text style={styles.itemPrice}>Price: ₱{item.price}</Text>
                      <Text
                        style={[
                          styles.itemQuantity,
                          { color: item.quantity <= 0 ? 'red' : 'black' },
                        ]}
                      >
                        Quantity: {item.quantity}
                        {item.quantity <= 0 && ' (Out of Stock)'}
                      </Text>
                    </View>
                    <View style={styles.sideEntryButtons}>
                      <View style={styles.multipleQuantity}>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => decrease(item.id)}
                        >
                          <Ionicons
                            name="remove-outline"
                            size={24}
                            color="black"
                          />
                        </Pressable>

                        <TextInput
                          style={styles.inputQuantity}
                          value={String(q)}
                          keyboardType="numeric"
                          onChangeText={text => changeDirect(item.id, text)}
                        />

                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => increase(item.id)}
                        >
                          <Ionicons
                            name="add-outline"
                            size={24}
                            color="black"
                          />
                        </Pressable>
                      </View>

                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(item)}
                        disabled={item.quantity <= 0}
                      >
                        <Ionicons
                          name="add-outline"
                          size={24}
                          color={item.quantity <= 0 ? '#999999' : '#FFFFFF'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.flexCenter}>
              <EmptyScreenComponent />
            </View>
          }
        />
      </View>

      <AlertBox visible={showAlert} message={alertMessage} />

      <Modal visible={confirmationModal} transparent animationType="fade">
        <View style={styles.wrapperModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Confirm Product</Text>
            <Text style={{ marginBottom: 5, fontSize: 16 }}>
              {modalQuantity} x {modalProduct?.name}.
            </Text>
            <Text style={{ marginBottom: 16, fontSize: 16 }}>
              Do you want to add it to the sales?
            </Text>
            <View style={styles.actionbtnContainer}>
              <Pressable
                onPress={() => {
                  setConfirmationModal(false);
                  setModalProduct(null);
                }}
                style={{ marginRight: 12 }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={confirmAddToCart}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
