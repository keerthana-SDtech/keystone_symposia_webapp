import { Navigate } from "react-router-dom";
import { AuthLayout } from "../features/auth/components/auth-layout";
import { SignupForm } from "../features/auth/components/signup-form";
import { useAuthContext } from "../app/providers/useAuthContext";
import { signupJsonSchema, signupUiSchema } from "../features/json-forms/schemas/auth.schemas";

export default function SignupPage() {
    const { isAuthenticated, user } = useAuthContext();

    if (isAuthenticated) {
        if (user?.role === "external_scientist") {
            return <Navigate to="/submission" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }
    return (
        <AuthLayout>
            <SignupForm schema={signupJsonSchema} uiSchema={signupUiSchema} />
        </AuthLayout>
    );
}
