import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    backgroundColor: 'red',
    elevation: 5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 24,
    overflow: 'hidden',
    maxHeight: '85%'
  },
  header: {
    height: 42,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 6,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 18
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: '#F194FF'
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
});

export default styles;
