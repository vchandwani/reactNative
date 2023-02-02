import AuthContent from '../components/Auth/AuthContent';
import { useContext, useState } from 'react';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { login } from '../util/auth';
import { ExpensesContext } from '../store/expenses-context';

function LoginScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const expCtx = useContext(ExpensesContext);
    const [error, setError] = useState(null);

    async function loginHandler({ email, password }) {
        setIsAuthenticating(true);
        try {
            const userData = await login(email, password);
            expCtx.authenticate(userData.token, userData.email);
        } catch (error) {
            setIsAuthenticating(false);
            setError({
                title: 'Authentication Failed',
                message:
                    'Could not log you in. Please check your credentials or try again later!',
            });
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message='Logging user...' />;
    }

    return <AuthContent isLogin onAuthenticate={loginHandler} error={error} />;
}

export default LoginScreen;
