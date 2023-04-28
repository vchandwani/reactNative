import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../../constants/styles';

import Button from '../UI/Button';
import Input from '../UI/Input';
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
          {error.title && <Text style={styles.errorLabel}>{error.title}</Text>}
          {error.message && (
            <Text style={styles.errorLabel}>{error.message}</Text>
          )}
        </View>
      )}
      {notificationMsg && (
        <Pressable onPress={closeNotification}>
          <View>
            <Text style={styles.notificationLabel}>{notificationMsg}</Text>
          </View>
        </Pressable>
      )}
      <View style={styles.width100}>
        <Input
          label='Email Address'
          invalid={emailIsInvalid}
          textInputConfig={{
            autoCapitalize: 'none',
            keyboardType: 'email-address',
            onChangeText: updateInputValueHandler.bind(this, 'email'),
            value: enteredEmail,
          }}
        />
        {!isLogin && (
          <Input
            label='Confirm Email Address'
            invalid={emailsDontMatch}
            textInputConfig={{
              autoCapitalize: 'none',
              keyboardType: 'email-address',
              onChangeText: updateInputValueHandler.bind(this, 'confirmEmail'),
              value: enteredConfirmEmail,
            }}
          />
        )}
        <Input
          label='Password'
          invalid={passwordIsInvalid}
          textInputConfig={{
            autoCapitalize: 'none',
            onChangeText: updateInputValueHandler.bind(this, 'password'),
            value: enteredPassword,
            secureTextEntry: true,
          }}
        />
        {!isLogin && (
          <Input
            label='Confirm Password'
            invalid={passwordsDontMatch}
            textInputConfig={{
              autoCapitalize: 'none',
              onChangeText: updateInputValueHandler.bind(
                this,
                'confirmPassword'
              ),
              value: enteredConfirmPassword,
              secureTextEntry: true,
            }}
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
