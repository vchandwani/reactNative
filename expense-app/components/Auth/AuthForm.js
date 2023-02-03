import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { GlobalStyles } from '../../constants/styles';

import Button from '../UI/Button';
import Input from './Input';
function AuthForm({
    isLogin,
    onSubmit,
    credentialsInvalid,
    error,
    notification,
}) {
    const [notificationMsg, setNotificationMsg] = useState(notification);
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');

    const {
        email: emailIsInvalid,
        confirmEmail: emailsDontMatch,
        password: passwordIsInvalid,
        confirmPassword: passwordsDontMatch,
    } = credentialsInvalid;
    useEffect(() => {
        setNotificationMsg(notification);
    }, [notification]);
    function updateInputValueHandler(inputType, enteredValue) {
        switch (inputType) {
            case 'email':
                setEnteredEmail(enteredValue);
                break;
            case 'confirmEmail':
                setEnteredConfirmEmail(enteredValue);
                break;
            case 'password':
                setEnteredPassword(enteredValue);
                break;
            case 'confirmPassword':
                setEnteredConfirmPassword(enteredValue);
                break;
        }
    }
    function resetHandler() {
        onSubmit({
            resetPassword: true,
            email: enteredEmail,
        });
    }
    function submitHandler() {
        onSubmit({
            email: enteredEmail,
            confirmEmail: enteredConfirmEmail,
            password: enteredPassword,
            confirmPassword: enteredConfirmPassword,
        });
    }
    function closeNotification() {
        setNotificationMsg(null);
    }

    return (
        <View style={styles.form}>
            {error && (
                <View>
                    {error.title && (
                        <Text style={styles.errorLabel}>{error.title}</Text>
                    )}
                    {error.message && (
                        <Text style={styles.errorLabel}>{error.message}</Text>
                    )}
                </View>
            )}
            {notificationMsg && (
                <Pressable onPress={closeNotification}>
                    <View>
                        <Text style={styles.notificationLabel}>
                            {notificationMsg}
                        </Text>
                    </View>
                </Pressable>
            )}
            <View>
                <Input
                    label='Email Address'
                    onUpdateValue={updateInputValueHandler.bind(this, 'email')}
                    value={enteredEmail}
                    keyboardType='email-address'
                    isInvalid={emailIsInvalid}
                />
                {!isLogin && (
                    <Input
                        label='Confirm Email Address'
                        onUpdateValue={updateInputValueHandler.bind(
                            this,
                            'confirmEmail'
                        )}
                        value={enteredConfirmEmail}
                        keyboardType='email-address'
                        isInvalid={emailsDontMatch}
                    />
                )}
                <Input
                    label='Password'
                    onUpdateValue={updateInputValueHandler.bind(
                        this,
                        'password'
                    )}
                    secure
                    value={enteredPassword}
                    isInvalid={passwordIsInvalid}
                />
                {!isLogin && (
                    <Input
                        label='Confirm Password'
                        onUpdateValue={updateInputValueHandler.bind(
                            this,
                            'confirmPassword'
                        )}
                        secure
                        value={enteredConfirmPassword}
                        isInvalid={passwordsDontMatch}
                    />
                )}
                <View style={styles.buttons}>
                    <Button onPress={submitHandler}>
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </Button>
                </View>
                {isLogin && (
                    <View style={styles.buttons}>
                        <Button
                            style={styles.resetButton}
                            mode={'flat'}
                            onPress={resetHandler}
                        >
                            Reset Password
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
}

export default AuthForm;

const styles = StyleSheet.create({
    resetButton: {
        backgroundColor: GlobalStyles.colors.primary100,
    },
    buttons: {
        marginTop: 12,
    },
    errorLabel: {
        color: GlobalStyles.colors.red100,
        marginBottom: 4,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    notificationLabel: {
        color: GlobalStyles.colors.font,
        backgroundColor: GlobalStyles.colors.green700,
        marginBottom: 4,
        textAlign: 'center',
        fontWeight: 'bold',
        minHeight: '20px',
        height: 'auto',
        borderRadius: '10px',
        justifyContent: 'center',
    },
});
