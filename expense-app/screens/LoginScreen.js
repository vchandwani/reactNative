import AuthContent from '../components/Auth/AuthContent';
import { useContext, useState } from 'react';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { login, passwordReset } from '../util/auth';
import { BudgetsContext } from '../store/budgets-context';

function LoginScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const budgetCtx = useContext(BudgetsContext);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    async function loginHandler({ email, password, resetPassword }) {
        setIsAuthenticating(true);
        try {
            if (resetPassword) {
                const userData = await passwordReset(email);
                if (userData) {
                    setIsAuthenticating(false);
                }
                setNotification('Reset link sent to ' + userData.email);
            } else {
                const userData = await login(email, password);
                budgetCtx.authenticate(userData.token, userData.email);
            }
        } catch (error) {
            setIsAuthenticating(false);

            setError({
                title: 'Authentication Failed',
                message: error.response.data.error.message
                    ? error.response.data.error.message
                    : 'Could not log you in. Please check your credentials or try again later!',
            });
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message='Logging user...' />;
    }

    return (
        <AuthContent
            isLogin
            onAuthenticate={loginHandler}
            error={error}
            notification={notification}
        />
    );
}

export default LoginScreen;
