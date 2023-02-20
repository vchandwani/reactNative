import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../../constants/styles';

function BudgetItem({ id, name, amount, category, recurring }) {
    const navigation = useNavigation();

    function budgetPressHandler() {
        navigation.navigate('ManageBudget', {
            budgetId: id,
        });
    }

    return (
        <Pressable
            onPress={budgetPressHandler}
            style={({ pressed }) => pressed && styles.pressed}
        >
            <View style={styles.item}>
                <View>
                    <Text style={[styles.textBase, styles.description]}>
                        {name}
                    </Text>
                    <Text style={[styles.textBase, styles.smallDescription]}>
                        {recurring && 'Recurring '.concat(category)}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amount}>{amount.toFixed(2)}</Text>
                </View>
            </View>
        </Pressable>
    );
}

export default BudgetItem;
