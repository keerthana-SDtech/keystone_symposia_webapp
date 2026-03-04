import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import type { LoginFormValues, SignupFormValues } from "../schemas";
import { useAuthContext } from "../../../app/providers/useAuthContext";
import { ROLE_HOME } from "../../../app/router/roleHome";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login: setAuthUser } = useAuthContext();

    const login = async (values: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.login(values);
            setAuthUser(response.user, response.accessToken, response.refreshToken);
            navigate(ROLE_HOME[response.user.role], { replace: true });
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (values: SignupFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.signup(values);
            setAuthUser(response.user, response.accessToken, response.refreshToken);
            navigate(ROLE_HOME[response.user.role], { replace: true });
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return { login, signup, isLoading, error };
};
