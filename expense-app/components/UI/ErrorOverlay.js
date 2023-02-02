import { View, Text, Button, StyleSheet } from 'react-native';

import { GlobalStyles } from '../../constants/styles';

function ErrorOverlay({ message, onConfirm }) {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, styles.title]}>An Error occurred!</Text>
            <Text style={styles.message}>{message}</Text>
            <Button title='Okay' onPress={onConfirm}>
                Okay
            </Button>
        </View>
    );
}

export default ErrorOverlay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary700,
    },
    text: {
        textAlign: 'center',
        marginBottom: 8,
        color: GlobalStyles.colors.font,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 24,
        color: GlobalStyles.colors.font,
    },
});
