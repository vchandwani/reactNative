import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { GlobalStyles } from '../../constants/styles';

const DateComponent = ({ label, invalid, style, textInputConfig }) => {
    console.log('textInputConfig');
    console.log(textInputConfig);
    const [date, setDate] = useState(
        textInputConfig.value ? new Date(textInputConfig.value) : new Date()
    );
    console.log('date');
    console.log(date);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(false);
            // for iOS, add a button that closes the picker
        }
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    return (
        <View style={[styles.dateContainer, style]}>
            <Button
                style={styles.rowInput}
                onPress={showDatepicker}
                title={label}
            />
            {date && (
                <Text style={[styles.rowInput, styles.input]}>
                    Date: {date.toDateString()}
                </Text>
            )}
            {show && (
                <DateTimePicker
                    style={styles.rowInput}
                    testID='dateTimePicker'
                    value={date}
                    mode={'date'}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}
        </View>
    );
};

export default DateComponent;

const styles = StyleSheet.create({
    rowInput: {
        flex: 1,
    },
    dateContainer: {
        marginHorizontal: 4,
        marginVertical: 8,
    },
    label: {
        fontSize: 12,
        color: GlobalStyles.colors.font,
        marginBottom: 4,
    },
    input: {
        color: GlobalStyles.colors.font,
        padding: 6,
        borderRadius: 6,
        fontSize: 18,
    },
    invalidLabel: {
        color: GlobalStyles.colors.error500,
    },
    invalidInput: {
        backgroundColor: GlobalStyles.colors.error50,
    },
});
