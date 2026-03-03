export interface LoginFormValues {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface SignupFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
