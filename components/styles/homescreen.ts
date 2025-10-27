import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,

    backgroundColor: '#FBFBFB',
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

  listEntry: { flex: 1, paddingHorizontal: 4 },

  Entry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',

    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 19,

    backgroundColor: '#FFFFFF',

    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'hsla(100, 18%, 13%, .1)',
  },

  addButton: {
    backgroundColor: '#00487C',
    padding: 10,
    borderRadius: 50,
  },

  TextContainer: {
    marginBottom: 5,
  },

  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  entryBottomPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    width: '100%',
  },

  descriptionPrice: {
    width: 140,

    marginTop: 3,
    paddingVertical: 6,
    paddingLeft: 6,

    backgroundColor: '#F6F6F6',

    borderRadius: 5,
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

    backgroundColor: '#F6F6F6',
    borderRadius: 30,
  },

  quantityButton: {
    padding: 10,

    borderRadius: '50%',
  },

  inputQuantity: {
    width: 45,

    padding: 2,

    borderColor: '#EAEAEA',
    borderLeftWidth: 1,
    borderRightWidth: 1,

    fontSize: 17,
    textAlign: 'center',
  },

  //Modal
  wrapperModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },

  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },

  actionbtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  confirmBtn: {
    backgroundColor: '#00487C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },

  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  cancelBtnText: {
    color: '#000000',
    fontSize: 16,
  },
});
