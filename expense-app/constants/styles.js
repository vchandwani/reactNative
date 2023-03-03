import { StyleSheet } from 'react-native';

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
        green50: '#91ba8f',
        green100: '#4b694a',
        green500: '#156b12',
        green700: '#043002',
        red100: '#9e777e',
        red500: '#990b25',
        font: '#FAFCF8',
    },
};

export const styles = StyleSheet.create({
    pressed: {
        opacity: 0.75,
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
    textBase: {
        color: GlobalStyles.colors.font,
    },
    description: {
        fontSize: 16,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    smallDescription: {
        fontSize: 12,
        marginBottom: 4,
    },
    infoContainer: {
        flex: 4,
        padding: 10,
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
});
