import { StyleSheet, View, Text, Picker } from 'react-native';

import { GlobalStyles } from '../../constants/styles';

function Select({ label, invalid, style, textInputConfig, data }) {
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
                onValueChange={(itemValue, itemIndex) =>
                    textInputConfig.onChangeText(itemValue)
                }
            >
                <Picker.Item
                    label={'Selecta a Value'}
                    value={null}
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
