import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
  TextInput,
} from 'react-native';
import { SearchBar } from '../component/searchBar';
import styles from '../../components/styles/homescreen';

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

export const Homescreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

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

  const handleAddToCart = useCallback(
    async (product: Product) => {
      const q = quantities[product.id] || 1;

      if (product.quantity < q) {
        Alert.alert(
          'Not enough stock',
          `Only ${product.quantity} left in stock.`,
        );
        return;
      }

      try {
        const db = await getDBConnection();

        // reduce product quantity by q
        const updatedProduct = { ...product, quantity: product.quantity - q };
        await updateProduct(db, updatedProduct);

        // record q sales
        for (let i = 0; i < q; i++) {
          await insertSale(db, product);
        }

        // ✅ reset this product's input back to 1
        setQuantities(prev => ({ ...prev, [product.id]: 1 }));

        await loadProducts();
        Alert.alert('Recorded', `${q} × ${product.name} added to sales list!`);
      } catch (error) {
        Alert.alert('Error', 'Failed to update product.');
      }
    },
    [quantities, loadProducts],
  );

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
                </View>

                <View style={styles.sideEntryButtons}>
                  <View style={styles.multipleQuantity}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => decrease(item.id)}
                    >
                      <Ionicons name="remove-outline" size={24} color="black" />
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
                      <Ionicons name="add-outline" size={24} color="black" />
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
            );
          }}
          ListEmptyComponent={
            <View style={styles.flexCenter}>
              <Text style={styles.emptyStyle}>No products found.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};
