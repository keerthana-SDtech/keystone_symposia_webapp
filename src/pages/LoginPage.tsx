import { Navigate } from "react-router-dom";
import { AuthLayout } from "../features/auth/components/auth-layout";
import { LoginForm } from "../features/auth/components/login-form";
import { useAuthContext } from "../app/providers/useAuthContext";
import { loginJsonSchema, loginUiSchema } from "../features/json-forms/schemas/auth.schemas";

export default function LoginPage() {
    const { isAuthenticated, user } = useAuthContext();

    if (isAuthenticated) {
        if (user?.role === "external_scientist") {
            return <Navigate to="/submission" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }
    return (
        <AuthLayout>
            <LoginForm schema={loginJsonSchema} uiSchema={loginUiSchema} />
        </AuthLayout>
    );
}
