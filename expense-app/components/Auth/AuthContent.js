import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FlatButton from '../UI/FlatButton';
import AuthForm from './AuthForm';
import { GlobalStyles } from '../../constants/styles';

function AuthContent({ isLogin, onAuthenticate, error, notification }) {
    const navigation = useNavigation();

    const [credentialsInvalid, setCredentialsInvalid] = useState({
        email: false,
        password: false,
        confirmEmail: false,
        confirmPassword: false,
    });

    function switchAuthModeHandler() {
        if (isLogin) {
            navigation.replace('Signup');
        } else {
            navigation.replace('Login');
        }
    }

    function submitHandler(credentials) {
        let { email, confirmEmail, password, confirmPassword, resetPassword } =
            credentials;
        email = email.trim();
        const emailIsValid = email.includes('@');

        if (!resetPassword) {
            password = password.trim();

            const passwordIsValid = password.length > 6;
            const emailsAreEqual = email === confirmEmail;
            const passwordsAreEqual = password === confirmPassword;

            if (
                !emailIsValid ||
                !passwordIsValid ||
                (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
            ) {
                setCredentialsInvalid({
                    email: !emailIsValid,
                    confirmEmail: !emailIsValid || !emailsAreEqual,
                    password: !passwordIsValid,
                    confirmPassword: !passwordIsValid || !passwordsAreEqual,
                });
                return;
            }
        } else {
            if (!emailIsValid) {
                setCredentialsInvalid({
                    email: !emailIsValid,
                });
                return;
            }
        }

        onAuthenticate({ email, password, resetPassword });
    }

    return (
        <View style={styles.authContent}>
            <AuthForm
                isLogin={isLogin}
                onSubmit={submitHandler}
                credentialsInvalid={credentialsInvalid}
                error={error}
                notification={notification}
            />
            <View style={styles.buttons}>
                <FlatButton onPress={switchAuthModeHandler}>
                    {isLogin ? 'Create a new user' : 'Log in instead'}
                </FlatButton>
            </View>
        </View>
    );
}

export default AuthContent;

const styles = StyleSheet.create({
    authContent: {
        marginTop: 64,
        marginHorizontal: 32,
        padding: 16,
        borderRadius: 8,
        backgroundColor: GlobalStyles.colors.primary800,
        elevation: 2,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
    },
    buttons: {
        marginTop: 8,
    },
});
