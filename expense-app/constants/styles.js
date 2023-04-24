import { StatusBar, StyleSheet } from 'react-native';

export const GlobalStyles = {
  colors: {
    primary50: '#67666b',
    primary100: '#302e36',
    primary200: '#2f2c38',
    primary400: '#2f2c38',
    primary500: '#312b3d',
    primary700: '#221c30',
    primary800: '#130f1c',
    accent500: '#f7bc0c',
    error100: '#fcdcbf',
    error50: '#fcc4e4',
    error500: '#9b095c',
    gray100: '#94919c',
    gray500: '#39324a',
    gray700: '#221c30',
    green10: '#DBEBDB',
    green50: '#91ba8f',
    green100: '#4b694a',
    green500: '#156b12',
    green700: '#043002',
    red10: '#EBD5DA',
    red100: '#9e777e',
    red500: '#990b25',
    font: '#FAFCF8',
    fontSecondary: '#DCDCDC',
  },
};

export const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  form: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.primary500,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  leanItem: {
    padding: 4,
    margin: 2,
  },
  rowItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 4,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  blackTextBase: {
    color: GlobalStyles.colors.gray700,
  },
  textBase: {
    color: GlobalStyles.colors.font,
  },
  description: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4,
    color: GlobalStyles.colors.font,
    textAlign: 'center',
  },
  smallDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoContainer: {
    flex: 4,
    padding: 10,
  },
  rowInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 4,
    padding: 4,
  },
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: GlobalStyles.colors.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    minWidth: 80,
    flex: 2,
    padding: 10,
  },
  amount: {
    color: GlobalStyles.colors.font,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  yearlyContainer: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    backgroundColor: GlobalStyles.colors.primary700,
  },
  infoText: {
    color: GlobalStyles.colors.font,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  containerSummary: {
    padding: 8,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  period: {
    fontSize: 12,
    color: GlobalStyles.colors.font,
  },
  sum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GlobalStyles.colors.font,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GlobalStyles.colors.font,
    margin: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GlobalStyles.colors.font,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.gray500,
  },
  parentHr: {
    height: 1,
    color: GlobalStyles.colors.font,
    width: '100%',
  },
  child: {
    backgroundColor: GlobalStyles.colors.primary800,
    padding: 16,
  },
  green: { color: GlobalStyles.colors.green10 },
  red: {
    color: GlobalStyles.colors.red10,
  },
  bold: {
    fontWeight: 'bold',
  },
  greenBackground: {
    color: GlobalStyles.colors.green10,
    backgroundColor: GlobalStyles.colors.green700,
    minWidth: '6rem',
    textAlign: 'left',
    flex: 0,
  },
  redBackground: {
    color: GlobalStyles.colors.red10,
    backgroundColor: GlobalStyles.colors.red500,
    minWidth: '6rem',
    textAlign: 'left',
    flex: 0,
  },
  tableHeader: {
    backgroundColor: GlobalStyles.colors.gray500,
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: GlobalStyles.colors.font,
  },

  divider: {
    color: GlobalStyles.colors.fontSecondary,
    height: '1px',
    marginTop: '4px',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 12,
    color: GlobalStyles.colors.font,
  },
  budgetSelect: {
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  budgetInfo: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  notificationLabel: {
    color: GlobalStyles.colors.green700,
    backgroundColor: GlobalStyles.colors.green50,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: 'bold',
    minHeight: '20px',
    height: 'auto',
    borderRadius: '10px',
    justifyContent: 'center',
  },
  deleteContainer: {
    top: 16,
    marginTop: 12,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
    marginTop: 40,
  },
  flex: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8,
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 2,
    width: '100%',
  },
  label: {
    fontSize: 12,
    color: GlobalStyles.colors.font,
    marginBottom: 4,
    marginLeft: 4,
  },

  checkbox: {
    alignSelf: 'center',
  },

  tabBar: {
    flexDirection: 'row',
    paddingTop: StatusBar.currentHeight,
    color: 'black',
    backgroundColor: 'white',
    fontSize: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    color: 'red',
    fontSize: 20,
  },
  switch: {
    marginLeft: 10,
    marginBottom: 4,
  },
  resetButton: {
    backgroundColor: GlobalStyles.colors.primary100,
  },
  buttonMargin: {
    marginTop: 12,
  },
  errorLabel: {
    color: GlobalStyles.colors.red100,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  width100: {
    width: '100%',
  },
  height100: {
    height: '100%',
  },
});
