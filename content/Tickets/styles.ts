import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    paddingHorizontal: 12
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400'
  },
  highlight: {
    fontWeight: '700'
  },
  header: {
    fontSize: 32
  },
  create_ticket_container: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 12
  },
  image_content: {
    flex: 1,
    flexBasis: 120,
    width: '100%'
  },
  container: {
    backgroundColor: 'white',
    padding: 12
  },
  dropdown: {
    position: 'relative',
    height: 42,
    borderWidth: 0.5,
    borderRadius: 6,
    paddingHorizontal: 12
  }
});

export default styles;
