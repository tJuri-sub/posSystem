import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const database_name = 'products.db';

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  return SQLite.openDatabase({
    name: database_name,
    location: 'default', // required
  });
};

export const createTables = async (db: SQLiteDatabase): Promise<void> => {
  const query = `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    quantity INTEGER
  );`;
  await db.executeSql(query);
  console.log('✅ Products table created');
};

export const insertProduct = async (
  db: SQLiteDatabase,
  name: string,
  price: number,
  quantity: number,
): Promise<void> => {
  const insertQuery = `INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)`;
  await db.executeSql(insertQuery, [name, price, quantity]);
};

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export const getProducts = async (db: SQLiteDatabase): Promise<Product[]> => {
  const results = await db.executeSql(
    'SELECT * FROM products ORDER BY name ASC',
  );

  const products: Product[] = [];

  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      products.push(result.rows.item(i) as Product);
    }
  });

  return products;
};

// In your database file
export const updateProduct = async (db: SQLiteDatabase, product: Product) => {
  const query = `
    UPDATE products 
    SET name = ?, price = ?, quantity = ?
    WHERE id = ?
  `;

  return db.executeSql(query, [
    product.name,
    product.price,
    product.quantity,
    product.id,
  ]);
};

export const deleteProduct = async (
  db: SQLiteDatabase,
  id: number,
): Promise<void> => {
  const query = `DELETE FROM products WHERE id = ?`;
  await db.executeSql(query, [id]);
};

export const deleteInvalidProducts = async (
  db: SQLiteDatabase,
): Promise<void> => {
  const query = `DELETE FROM products WHERE name = '' OR price = 0 OR quantity = 0`;
  await db.executeSql(query);
};

// --- SALES TABLE ---
// each row is a single product added to sales

export const createSalesTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER,
      name TEXT,
      price REAL,
      createdAt TEXT
    );`;
  await db.executeSql(query);
  console.log('✅ Sales table ready');
};

export const insertSale = async (
  db: SQLiteDatabase,
  product: Product,
): Promise<void> => {
  const query = `INSERT INTO sales (productId, name, price, createdAt)
                 VALUES (?, ?, ?, datetime('now'))`;
  await db.executeSql(query, [product.id, product.name, product.price]);
};

export interface SaleItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  createdAt: string;
}

export const getSales = async (db: SQLiteDatabase): Promise<SaleItem[]> => {
  const results = await db.executeSql(
    'SELECT * FROM sales ORDER BY createdAt DESC',
  );
  const items: SaleItem[] = [];
  results.forEach(res => {
    for (let i = 0; i < res.rows.length; i++) {
      items.push(res.rows.item(i) as SaleItem);
    }
  });
  return items;
};

export const clearSales = async (db: SQLiteDatabase): Promise<void> => {
  await db.executeSql('DELETE FROM sales');
  console.log('✅ All sales cleared');
};
