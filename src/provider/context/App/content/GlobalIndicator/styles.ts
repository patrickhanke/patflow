import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modal_container: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
    width: 'auto',
    gap: 6,
    zIndex: 15,
    elevation: 15
  },
  modal: {
    flex: 1,
    backgroundColor: 'green',
    height: 'auto',
    minWidth: 120,
    position: 'relative',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 3
  },
  modalContent: {
    paddingHorizontal: 12,
    paddingVertical: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    flexBasis: 240,
    flexGrow: 1,
    flexShrink: 0.5
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
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
});

export default styles;
