import { GlobalStyles, styles } from '../../constants/styles';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DECREMENT, INCREMENT } from '../../util/constants';

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
        <View style={styles.rootContainer}>
            <View style={[styles.form, styles.flex]}>
                <View style={styles.fieldContainer}>
                    <View pointerEvents={!years[index - 1] && 'none'}>
                        <MaterialIcons
                            style={styles.textBase}
                            name='navigate-before'
                            size={24}
                            onClick={() => yearNav(DECREMENT)}
                            value={-1}
                        />
                    </View>
                    <Text style={styles.title}>{year}</Text>
                    <View pointerEvents={!years[index + 1] && 'none'}>
                        <MaterialIcons
                            name='navigate-next'
                            style={styles.textBase}
                            size={24}
                            onClick={() => yearNav(INCREMENT)}
                            value={+1}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default YearScroll;
