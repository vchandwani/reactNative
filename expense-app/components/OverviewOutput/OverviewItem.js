import {
    Pressable,
    Text,
    View,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import {
    Dialog,
    DialogHeader,
    DialogContent,
    Divider,
} from '@react-native-material/core';

import { styles } from '../../constants/styles';
import { useState } from 'react';
import { EXPENSE } from '../../util/constants';
import { getFormattedDate } from '../../util/date';

function CategoryItem({
    category,
    name,
    spentAmount,
    targetAmount,
    categoryTransactions,
}) {
    const [visible, setVisible] = useState(false);
    const layout = useWindowDimensions();

    const toggleDialog = () => {
        setVisible(!visible);
    };

    const categoryPressHandler = () => {
        if (categoryTransactions.length > 0) {
            setVisible(true);
        }
    };

    const description = (txs, i) => {
        let amount = null;
        let type = null;
        let category = null;
        if (txs.amount) {
            amount = (
                <Text style={[styles.amount, styles.textBase]}>
                    $ {txs.amount}
                </Text>
            );
        }
        if (txs?.type) {
            type =
                txs.type === EXPENSE ? (
                    <Text style={[styles.textBase]}>spent</Text>
                ) : (
                    txs.type === INCOME && (
                        <Text style={[styles.textBase]}>incurred</Text>
                    )
                );
        }
        if (txs.category) {
            category = (
                <Text style={[styles.amount, styles.textBase]}>
                    {' on ' + txs.category}
                </Text>
            );
        }
        const date = (
            <Text style={styles.textBase}>
                {getFormattedDate(new Date(txs.date))}
            </Text>
        );
        return (
            <View onStartShouldSetResponder={() => true} key={txs.id}>
                <View style={styles.rowContainer}>
                    <Text>
                        {amount} {type} {category}
                    </Text>
                </View>
                {txs && txs.description && (
                    <Text style={styles.blackTextBase}>
                        {txs.description} {date}
                    </Text>
                )}
                {txs && txs.email && (
                    <Text style={styles.blackTextBase}>{txs.email}</Text>
                )}
                <Divider />
            </View>
        );
    };
    const remainingAmount = targetAmount - spentAmount;

    return (
        <Pressable
            onPress={categoryPressHandler}
            style={({ pressed }) => pressed && styles.pressed}
        >
            <Dialog
                visible={visible}
                onDismiss={toggleDialog}
                maxWidth={false}
                style={{ padding: '10px' }}
            >
                <DialogHeader title='Transactions' />
                <DialogContent>
                    <ScrollView style={{ maxHeight: layout.width }}>
                        {categoryTransactions &&
                            categoryTransactions.map((txs, i) => {
                                return description(txs, i);
                            })}
                    </ScrollView>
                </DialogContent>
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
