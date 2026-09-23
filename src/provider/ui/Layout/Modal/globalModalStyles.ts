import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    zIndex: 5,
    elevation: 5
  },
  header: {
    height: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 6,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12
  },
  modalContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flex: 1
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
