import { StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { GlobalStyles } from '../../constants/styles';

function Select({ label, invalid, style, textInputConfig, onChange, data }) {
    const inputStyles = [styles.input];

    if (invalid) {
        inputStyles.push(styles.invalidInput);
    }

    return (
        <View style={[styles.inputContainer, style]}>
            <Text style={[styles.label, invalid && styles.invalidLabel]}>
                {label}
            </Text>

            <Picker
                {...textInputConfig}
                selectedValue={textInputConfig.value}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
            >
                <Picker.Item
                    label={'Select a Value'}
                    value={''}
                    key={'defaultVal'}
                />
                {data.map((val) => {
                    return (
                        <Picker.Item
                            label={val.label}
                            value={val.id}
                            key={val.id}
                        />
                    );
                })}
            </Picker>
        </View>
    );
}

export default Select;

const styles = StyleSheet.create({
    selected: {
        color: 'red',
    },
    inputContainer: {
        marginHorizontal: 4,
        marginVertical: 8,
    },
    label: {
        fontSize: 12,
        color: GlobalStyles.colors.font,
        marginBottom: 4,
    },
    input: {
        backgroundColor: GlobalStyles.colors.primary100,
        color: GlobalStyles.colors.font,
        padding: 6,
        borderRadius: 6,
        fontSize: 18,
    },
    inputMultiline: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    invalidLabel: {
        color: GlobalStyles.colors.error500,
    },
    invalidInput: {
        backgroundColor: GlobalStyles.colors.error50,
    },
});
