import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 120,
    paddingHorizontal: 10,

    backgroundColor: '#FBFBFB',
  },

  tableEntryContainer: {
    marginVertical: 10,
    height: '100%',
  },

  idHeader: {
    marginBottom: 5,
    paddingBottom: 5,

    borderBottomWidth: 1,
    borderColor: 'hsla(100, 18%, 13%, .2)',
  },

  entryContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 19,

    backgroundColor: '#fff',

    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'hsla(100, 18%, 13%, .1)',

    boxShadow: '2px 2px 3px hsla(0, 0%, 0%, .2)',
  },

  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  productDescriptionContainer: {
    flexDirection: 'row',
    gap: 20,
  },

  productNameContainer: {
    marginVertical: 10,
  },

  productPrizeContainer: {
    flexDirection: 'row',
  },

  productQuantityContainer: {
    flexDirection: 'row',
  },

  tableEntryName: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  tableEntryText: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  align: {
    textAlign: 'center',
  },

  Entry: {},

  addButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    padding: 10,
    width: '17%',
    aspectRatio: 1 / 1,

    backgroundColor: '#00487C',
    borderRadius: '50%',
    boxShadow: '0px 2px 3px rgba(0,0,0,0.3)',

    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  flexAlign: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  listEntry: { flex: 1, paddingHorizontal: 4 },

  //   Modal
  addProductModalContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  addProductModal: {
    padding: 15,
    width: '80%',

    backgroundColor: '#ffffff',
    borderRadius: 7,
  },

  headerModalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 10,
    marginBottom: 10,

    borderBottomWidth: 1,
    borderColor: '#d3d3d3ff',
  },

  headerModal: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  inputModalContainer: {
    display: 'flex',
    gap: 15,
    marginBottom: 20,
  },

  labelModal: {
    fontSize: 16,
    marginBottom: 4,
  },

  inputModal: {
    padding: 5,

    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 5,

    fontSize: 16,
    color: '#000000',
  },

  buttonModalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },

  buttonModal: {
    width: '48%',
    padding: 13,

    borderWidth: 2,
    borderRadius: 5,
  },

  cancelButtonModal: {
    backgroundColor: '#ffffff',
  },

  addButtonModal: {
    backgroundColor: '#999',
  },

  textButtonModal: {
    fontSize: 16,
    textAlign: 'center',
  },

  errorMessage: {
    color: 'red',
    fontSize: 12,
  },
});
