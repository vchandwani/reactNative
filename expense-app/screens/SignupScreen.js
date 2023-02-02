import { useContext, useState } from 'react';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ExpensesContext } from '../store/expenses-context';
import { createUser } from '../util/auth';

function SignupScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState(null);

    const expCtx = useContext(ExpensesContext);

    async function signupHandler({ email, password }) {
        setIsAuthenticating(true);
        try {
            const userData = await createUser(email, password);
            expCtx.authenticate(userData.token, userData.email);
        } catch (error) {
            setError({
                title: 'Authentication Failed',
                message:
                    'Could not create user. Please check your input or try again later!',
            });
            setIsAuthenticating(false);
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message='Creating user...' />;
    }

    return <AuthContent onAuthenticate={signupHandler} error={error} />;
}

export default SignupScreen;
