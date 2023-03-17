import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../../constants/styles';
import { getFormattedDate } from '../../util/date';

function TransactionItem({ id, description, amount, date }) {
    const dateVal = typeof date.getMonth === 'function' ? date : new Date(date);
    const navigation = useNavigation();

    function transactionPressHandler() {
        navigation.navigate('ManageTransaction', {
            transactionId: id,
            date: date,
        });
    }

    return (
        <Pressable
            onPress={transactionPressHandler}
            style={({ pressed }) => pressed && styles.pressed}
        >
            <View style={styles.item}>
                <View style={styles.infoContainer}>
                    <Text style={[styles.textBase, styles.description]}>
                        {description}
                    </Text>
                    <Text style={styles.textBase}>
                        {getFormattedDate(dateVal)}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amount}>{amount.toFixed(2)}</Text>
                </View>
            </View>
        </Pressable>
    );
}

export default TransactionItem;
