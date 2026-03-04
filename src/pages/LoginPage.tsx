import { AuthLayout } from "../features/auth/components/auth-layout";
import { LoginForm } from "../features/auth/components/login-form";
import { loginJsonSchema, loginUiSchema } from "../features/json-forms/schemas/auth.schemas";

interface LoginPageProps {
    variant?: 'external' | 'staff';
}

export default function LoginPage({ variant = 'external' }: LoginPageProps) {
    return (
        <AuthLayout>
            <LoginForm schema={loginJsonSchema} uiSchema={loginUiSchema} variant={variant} />
        </AuthLayout>
    );
}
