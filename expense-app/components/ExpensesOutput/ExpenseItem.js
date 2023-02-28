import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../../constants/styles';
import { getFormattedDate } from '../../util/date';

function ExpenseItem({ id, description, amount, date }) {
    const navigation = useNavigation();

    function expensePressHandler() {
        navigation.navigate('ManageExpense', {
            expenseId: id,
        });
    }

    return (
        <Pressable
            onPress={expensePressHandler}
            style={({ pressed }) => pressed && styles.pressed}
        >
            <View style={styles.item}>
                <View>
                    <Text style={[styles.textBase, styles.description]}>
                        {description}
                    </Text>
                    <Text style={styles.textBase}>
                        {getFormattedDate(date)}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amount}>{amount.toFixed(2)}</Text>
                </View>
            </View>
        </Pressable>
    );
}

export default ExpenseItem;
