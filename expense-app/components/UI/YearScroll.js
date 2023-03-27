import { GlobalStyles, styles } from '../../constants/styles';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DECREMENT, INCREMENT } from '../../util/constants';
import Button from '../UI/Button';

function YearScroll({ onYearChange, index, years }) {
    const year = years[index] ? years[index] : years[0];

    const yearNav = (op) => {
        if (op === INCREMENT) {
            onYearChange(+1);
        }
        if (op === DECREMENT) {
            onYearChange(-1);
        }
    };

    return (
        <View style={(styles.rootContainer, { minHeight: 50 })}>
            <View style={[styles.form, styles.flex]}>
                <View style={styles.fieldContainer}>
                    <View pointerEvents={years[index - 1] ? 'auto' : 'none'}>
                        <Button
                            onPress={() => yearNav(DECREMENT)}
                            style={{ height: 40, width: 40 }}
                        >
                            <MaterialIcons
                                style={styles.textBase}
                                name='navigate-before'
                                size={24}
                                value={-1}
                            />
                        </Button>
                    </View>
                    <Text style={styles.title}>{year}</Text>
                    <View pointerEvents={years[index + 1] ? 'auto' : 'none'}>
                        <Button
                            onPress={() => yearNav(INCREMENT)}
                            style={{ height: 40, width: 40 }}
                        >
                            <MaterialIcons
                                name='navigate-next'
                                style={styles.textBase}
                                size={24}
                                value={+1}
                            />
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default YearScroll;
