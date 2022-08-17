import { Alert } from "react-native";
import AuthContent from "../components/Auth/AuthContent";
import { useContext, useState } from "react";
import LoadingOverlayAuth from "../components/UI/LoadingOverlayAuth";
import { login } from "../util/auth";
import { ExpensesContext } from "../store/expenses-context";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const expCtx = useContext(ExpensesContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      expCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        "Authentication Failed",
        "Could not log you in. Please check your credentials or try again later!"
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlayAuth message="Logging user..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
