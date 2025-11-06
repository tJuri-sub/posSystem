import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import styles from '../styles/inventory';
import { useFocusEffect } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { SearchBar } from '../component/searchBar';

import {
  getDBConnection,
  createTables,
  insertProduct,
  getProducts,
  Product,
  deleteInvalidProducts,
  deleteProduct,
} from '../../database';
import { EmptyScreenComponent } from '../component/emptyListComponent';

export const Inventory = () => {
  const [addProductModal, setAddProductModal] = useState<boolean>(false);

  const [dbReady, setDbReady] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Function to load products from database
  const loadProducts = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTables(db);

      // Cleanup invalid rows
      await deleteInvalidProducts(db);

      const data = await getProducts(db);
      setProducts(data);
      setDbReady(true);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, []);

  // Initial load on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (dbReady) {
        loadProducts();
      }
    }, [loadProducts, dbReady]),
  );

  // Reset form fields
  const resetForm = useCallback(() => {
    setProductName('');
    setPrice('');
    setQuantity('');
    setErrorMsg('');
    setSubmitted(false);
  }, []);

  const handleAddProduct = async () => {
    setSubmitted(true);
    if (!dbReady) return;

    if (!productName.trim()) {
      setErrorMsg('Please enter a valid product name.');
      return;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price.');
      return;
    }
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) < 0) {
      setErrorMsg('Please enter a valid quantity.');
      return;
    }

    try {
      setErrorMsg('');
      setSubmitted(false);

      const db = await getDBConnection();
      await insertProduct(db, productName, Number(price), Number(quantity));
      await loadProducts(); // Refresh the list

      // Reset & close modal
      setAddProductModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMsg('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = async () => {
    setSubmitted(true);
    if (!dbReady || !editingProduct) return;

    if (!productName.trim()) {
      setErrorMsg('Please enter a valid product name.');
      return;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price.');
      return;
    }
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) < 0) {
      setErrorMsg('Please enter a valid quantity.');
      return;
    }

    try {
      setErrorMsg('');
      setSubmitted(false);

      const db = await getDBConnection();
      await db.executeSql(
        `UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?`,
        [productName, Number(price), Number(quantity), editingProduct.id],
      );
      await loadProducts(); // Refresh the list

      // Reset & close modal
      setAddProductModal(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Error editing product:', error);
      setErrorMsg('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!dbReady) return;

    try {
      const db = await getDBConnection();
      await deleteProduct(db, id); // Pass the id to deleteProduct
      await loadProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleModalClose = () => {
    setAddProductModal(false);
    setEditingProduct(null);
    resetForm();
  };

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} />

      <View style={styles.tableEntryContainer}>
        <FlatList
          style={styles.listEntry}
          contentContainerStyle={{ flexGrow: 1 }}
          data={filteredProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.entryContainer}>
              <View style={styles.Entry}>
                <View style={styles.idHeader}>
                  <Text>{item.id}</Text>
                </View>

                <View style={styles.flexContainer}>
                  <View>
                    <View style={[styles.productNameContainer]}>
                      <Text style={styles.tableEntryName}>{item.name}</Text>
                    </View>

                    <View style={styles.productDescriptionContainer}>
                      <View style={styles.productPrizeContainer}>
                        <Text>Prize: </Text>
                        <Text style={styles.tableEntryText}>₱{item.price}</Text>
                      </View>

                      <View style={styles.productQuantityContainer}>
                        <Text>Stock Quantity: </Text>
                        <Text
                          style={[
                            styles.tableEntryText,
                            styles.align,
                            // Add visual indicators for stock levels
                            item.quantity <= 0 && { color: 'red' },
                            item.quantity > 0 &&
                              item.quantity <= 2 && { color: 'orange' },
                          ]}
                        >
                          {item.quantity}
                          {item.quantity <= 0 && ' (Out of Stock)'}
                          {item.quantity > 0 &&
                            item.quantity <= 2 &&
                            ' (Low Stock)'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingProduct(item);
                        setProductName(item.name);
                        setPrice(item.price.toString());
                        setQuantity(item.quantity.toString());
                        setAddProductModal(true);
                      }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={24}
                        color="skyblue"
                      />
                    </TouchableOpacity>

                    <Pressable onPress={() => handleDeleteProduct(item.id)}>
                      <Ionicons name="trash-outline" size={24} color="red" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.flexAlign}>
              <EmptyScreenComponent
                tab="Inventory"
                icon={
                  <Image
                    source={require('../assets/images/EmptyLogo.png')}
                    style={{ width: 150, height: 150 }}
                  />
                }
              />
            </View>
          }
          refreshing={false}
          onRefresh={loadProducts}
        />
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingProduct(null);
          resetForm();
          setAddProductModal(true);
        }}
      >
        <Ionicons name="add-outline" size={35} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={addProductModal} transparent animationType="fade">
        <View style={styles.addProductModalContainer}>
          <View style={styles.addProductModal}>
            <View style={styles.headerModalContainer}>
              <Text style={styles.headerModal}>
                {editingProduct ? 'Edit your product' : 'Add your product'}
              </Text>
            </View>

            <View style={styles.inputModalContainer}>
              <View>
                <Text style={styles.labelModal}>Product name</Text>
                <TextInput
                  style={styles.inputModal}
                  placeholder="ex. Nestle Milo"
                  placeholderTextColor="#999999"
                  value={productName}
                  onChangeText={setProductName}
                />
                {submitted &&
                  errorMsg === 'Please enter a valid product name.' && (
                    <Text style={styles.errorMessage}>{errorMsg}</Text>
                  )}
              </View>

              <View>
                <Text style={styles.labelModal}>Price</Text>
                <TextInput
                  style={styles.inputModal}
                  placeholder="ex. 15"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
                {submitted && errorMsg === 'Please enter a valid price.' && (
                  <Text style={styles.errorMessage}>{errorMsg}</Text>
                )}
              </View>

              <View>
                <Text style={styles.labelModal}>Quantity</Text>
                <TextInput
                  style={styles.inputModal}
                  placeholder="ex. 20"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
                {submitted && errorMsg === 'Please enter a valid quantity.' && (
                  <Text style={styles.errorMessage}>{errorMsg}</Text>
                )}
              </View>
            </View>

            <View style={styles.buttonModalContainer}>
              <Pressable
                style={[styles.buttonModal, styles.cancelButtonModal]}
                onPress={handleModalClose}
              >
                <Text style={styles.textButtonModal}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonModal, styles.addButtonModal]}
                onPress={editingProduct ? handleEditProduct : handleAddProduct}
              >
                <Text style={styles.textButtonModal}>
                  {editingProduct ? 'Save Changes' : 'Add'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
