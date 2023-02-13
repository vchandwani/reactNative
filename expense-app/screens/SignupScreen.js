import { useContext, useState } from 'react';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { BudgetsContext } from '../store/budgets-context';
import { createUser } from '../util/auth';

function SignupScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState(null);

    const budgetCtx = useContext(BudgetsContext);

    async function signupHandler({ email, password }) {
        setIsAuthenticating(true);
        try {
            const userData = await createUser(email, password);
            budgetCtx.authenticate(userData.token, userData.email);
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
