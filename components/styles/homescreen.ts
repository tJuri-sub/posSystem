import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,

    backgroundColor: '#F9FBEF',
  },

  productList: {
    flex: 1,
    width: '100%',

    marginTop: 10,
  },

  flexCenter: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyStyle: {
    fontSize: 16,
    textAlign: 'center',
  },

  Entry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',

    padding: 8,
    marginBottom: 10,

    backgroundColor: '#dcdbd3ff',

    borderRadius: 7,
    borderColor: '#222222',

    boxShadow: '1px 1px 3px rgba(0,0,0,0.5)',
  },

  addButton: {
    backgroundColor: '#B79600',
    padding: 10,
    borderRadius: 50,
  },

  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  itemPrice: {
    fontSize: 16,
  },

  itemQuantity: {
    fontSize: 16,
  },

  sideEntryButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  multipleQuantity: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButton: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 4,
  },

  inputQuantity: {
    backgroundColor: '#fff',
    padding: 5,

    marginHorizontal: 5,
    width: 50,
    borderRadius: 4,
  },
});
