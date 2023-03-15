import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../../constants/styles';

function CategoryItem({ category, name, spentAmount, targetAmount }) {
    const navigation = useNavigation();

    function categoryPressHandler() {
        // navigation.navigate('ManageTransaction', {
        //     transactionId: id,
        //     date: date,
        // });
    }

    const remainingAmount = targetAmount - spentAmount;

    return (
        <Pressable
            onPress={categoryPressHandler}
            style={({ pressed }) => pressed && styles.pressed}
        >
            <View style={styles.rowItem}>
                <View style={styles.rowInfoContainer}>
                    <Text style={[styles.textBase, styles.description]}>
                        {name} - {category}
                    </Text>
                </View>
                <View style={[styles.item, styles.leanItem]}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.textBase}>Available</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={[styles.green, styles.bold]}>
                            {targetAmount.toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View style={[styles.item, styles.leanItem]}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.textBase}>Spent</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={[styles.red, styles.bold]}>
                            {spentAmount.toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View style={[styles.item, styles.leanItem]}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.textBase}>Remaining</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text
                            style={[
                                remainingAmount > 0 ? styles.green : styles.red,
                                styles.bold,
                            ]}
                        >
                            {remainingAmount.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

export default CategoryItem;
