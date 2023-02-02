import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { ExpensesContext } from '../store/expenses-context';
import { GlobalStyles } from '../constants/styles';

function WelcomeScreen() {
    const [fetchedMessage, setFetchedMesssage] = useState('');

    const expCtx = useContext(ExpensesContext);
    const token = expCtx.token;

    useEffect(() => {
        axios
            .get(
                'https://react-native-course-624d6-default-rtdb.firebaseio.com/message.json?auth=' +
                    token
            )
            .then((response) => {
                setFetchedMesssage(response.data);
            });
    }, [token]);

    return (
        <View style={styles.rootContainer}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.description}>
                You authenticated successfully!
            </Text>
            <Text style={styles.description}>{fetchedMessage}</Text>
        </View>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: GlobalStyles.colors.font,
    },
    description: {
        fontSize: 16,
        marginBottom: 8,
        color: GlobalStyles.colors.font,
    },
});
