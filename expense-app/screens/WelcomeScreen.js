import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { ExpensesContext } from '../store/expenses-context';

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
            <Text>You authenticated successfully!</Text>
            <Text>{fetchedMessage}</Text>
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
    },
});
