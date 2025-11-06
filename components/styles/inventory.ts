import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 150,
    paddingHorizontal: 10,

    backgroundColor: '#FBFBFB',
  },

  Title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  tableHeader: {
    flexDirection: 'row',

    backgroundColor: '#999',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,

    marginTop: 10,
    paddingHorizontal: 5,
  },

  tableText: {
    fontSize: 16,
  },

  tableFlex: {
    padding: 5,
  },

  tableWidth1: {
    width: '60%',
  },

  tableWidth2: {
    width: '20%',
  },

  tableWidth3: {
    width: '20%',
  },

  tableEntryButton: {
    marginTop: 5,
    marginHorizontal: 5,
    paddingVertical: 10,

    backgroundColor: '#fff',
    borderRadius: 4,
  },

  tableEntryContainer: {
    height: '100%',
    overflow: 'hidden',

    backgroundColor: '#c8c8c8ff',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,

    boxShadow:
      'inset 2px 2px 3px rgba(0,0,0,0.2), inset -2px -2px 3px rgba(255, 255, 255, 0.2),',
  },

  tableEntryName: {
    fontSize: 20,
  },

  tableEntryText: {
    fontSize: 16,
  },

  align: {
    textAlign: 'center',
  },

  tableHeaderEntry: {
    flexDirection: 'row',
  },

  addButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    padding: 10,
    width: '17%',
    aspectRatio: 1 / 1,

    backgroundColor: '#B79600',
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
