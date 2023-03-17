import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles, GlobalStyles } from '../../constants/styles';

function Accordian({ title, data, open }) {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setExpanded(open);
            }, 100);
        }
    }, [open]);

    const changeExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.row}
                name={title}
                onPress={changeExpand.bind(this)}
            >
                <Text style={[styles.title, styles.font]}>{title}</Text>
                <Icon
                    name={
                        expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
                    }
                    size={30}
                    color={GlobalStyles.colors.font}
                />
            </TouchableOpacity>
            <View style={styles.parentHr} />
            {expanded && <View style={styles.child}>{data}</View>}
        </View>
    );
}

export default Accordian;
