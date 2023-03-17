import { Pressable, Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogActions,
    Divider,
} from '@react-native-material/core';

import { styles } from '../../constants/styles';
import { useState } from 'react';
import Button from '../UI/Button';
import { EXPENSE } from '../../util/constants';
import { getFormattedDate } from '../../util/date';

function CategoryItem({
    category,
    name,
    spentAmount,
    targetAmount,
    categoryTransactions,
}) {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);

    const toggleDialog = () => {
        setVisible(!visible);
    };

    const categoryPressHandler = () => {
        if (categoryTransactions.length > 0) {
            setVisible(true);
        }
    };

    const description = (txs, i) => {
        const type =
            txs.type === EXPENSE ? 'spent' : txs.type === INCOME && 'incurred';
        const amount = <Text style={styles.amount}>$ {txs.amount}</Text>;
        const category = <Text style={styles.amount}> {txs.category}</Text>;
        const date = (
            <Text style={styles.amount}>
                {getFormattedDate(new Date(txs.date))}
            </Text>
        );

        return (
            <View key={i + txs.category + txs.date}>
                <Text style={styles.textBase}>
                    {amount} {type} on {category}
                </Text>
                <Text style={styles.textBase}>
                    {txs.description} {date}
                </Text>
                <Text style={styles.textBase}>{txs.email}</Text>
                <Divider style={styles.divider} />
            </View>
        );
    };
    const remainingAmount = targetAmount - spentAmount;

    return (
        <Pressable
            onPress={categoryPressHandler}
            style={({ pressed }) => pressed && styles.pressed}
        >
            <Dialog visible={visible} onDismiss={toggleDialog} maxWidth={false}>
                <DialogHeader title='Transactions' />
                <ScrollView>
                    <DialogContent>
                        {categoryTransactions.map((txs, i) => {
                            return description(txs, i);
                        })}
                    </DialogContent>
                </ScrollView>
                <DialogActions>
                    <Button onPress={toggleDialog} mode='flat'>
                        Cancel
                    </Button>
                    <Button onPress={toggleDialog} mode='flat'>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
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
