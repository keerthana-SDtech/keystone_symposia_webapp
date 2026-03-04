import { AuthLayout } from "../features/auth/components/auth-layout";
import { LoginForm } from "../features/auth/components/login-form";

interface LoginPageProps {
    variant?: 'external' | 'staff';
}

export default function LoginPage({ variant = 'external' }: LoginPageProps) {
    return (
        <AuthLayout>
            <LoginForm variant={variant} />
        </AuthLayout>
    );
}
