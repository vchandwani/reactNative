import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../../constants/styles';

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
        <View style={[styles.form, styles.flex]}>
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
            <View style={styles.width100}>
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
                <View style={styles.buttonMargin}>
                    <Button onPress={submitHandler}>
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </Button>
                </View>
                {isLogin && (
                    <View style={styles.buttonMargin}>
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
