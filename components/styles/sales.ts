import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FBFBFB',
  },

  entry: {
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

    boxShadow: '2px 2px 3px hsla(0, 0%, 0%, .2)',
  },

  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  descriptionSales: {
    marginTop: 3,
    padding: 6,

    backgroundColor: '#F6F6F6',

    borderRadius: 5,
  },

  totalQuantityContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  totalPrizeContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  total: { fontSize: 20, fontWeight: 'bold' },

  TextContainer: {
    marginBottom: 5,
  },

  itemName: { fontSize: 20, fontWeight: 'bold' },

  textSales: { fontSize: 16, fontWeight: 'bold' },

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

  editButton: {
    backgroundColor: '#00487C',
    padding: 15,
    borderRadius: 50,
  },

  emptyStyle: {
    fontSize: 16,
    textAlign: 'center',
  },

  listEntry: { flex: 1, paddingHorizontal: 4 },

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
