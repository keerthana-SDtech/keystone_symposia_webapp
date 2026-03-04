import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { loginSchema } from "../schemas";
import type { LoginFormValues } from "../schemas";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";

import { useTenant } from "../../../app/providers/TenantProvider";

interface LoginFormProps {
    variant?: 'external' | 'staff';
}

export const LoginForm = ({ variant = 'external' }: LoginFormProps) => {
    const { login, isLoading, error } = useAuth();
    const { name, logo, logoWidth, logoHeight } = useTenant();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = (values: LoginFormValues) => {
        login(values);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col items-start mb-10">
                <img
                    src={logo}
                    alt={name}
                    style={{ width: logoWidth, height: logoHeight }}
                    className="mb-8 object-contain"
                />
                <h2 className="text-[30px] font-bold text-[#111827] mb-3">Welcome Back</h2>
                <p className="text-[#6b7280] text-[14.5px]">
                    Enter your credentials to login and submit concept
                </p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-[14px]">
                    {error}
                </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2 flex flex-col items-start">
                    <Label htmlFor="email" className="text-[14.5px] font-medium text-[#111827]">
                        Email<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter email"
                        {...form.register("email")}
                        className={`h-11 border-gray-200 focus:ring-primary focus:border-primary text-[14.5px] ${form.formState.errors.email ? 'border-red-500' : ''}`}
                    />
                    {form.formState.errors.email && (
                        <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2 flex flex-col items-start">
                    <Label htmlFor="password" className="text-[14.5px] font-medium text-[#111827]">
                        Password<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter password"
                        {...form.register("password")}
                        className={`h-11 border-gray-200 focus:ring-primary focus:border-primary text-[14.5px] ${form.formState.errors.password ? 'border-red-500' : ''}`}
                    />
                    {form.formState.errors.password && (
                        <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="rememberMe"
                            onCheckedChange={(checked) => form.setValue("rememberMe", checked as boolean)}
                            className="w-[18px] h-[18px] border-gray-300 rounded-[4px] data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="rememberMe" className="text-[14px] text-[#374151] cursor-pointer font-normal">
                            Remember Me
                        </Label>
                    </div>
                    {variant === 'external' && (
                        <Link to="/forgot-password" className="text-[14px] font-medium text-primary hover:underline">
                            Forget Password?
                        </Link>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:opacity-90 text-primary-foreground h-[46px] text-[15px] font-normal rounded-md shadow-sm hover:shadow-md transition-all mt-6"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </Button>

                {variant === 'external' && (
                    <p className="text-center text-[14px] text-[#374151] mt-6">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary font-medium hover:underline">
                            Sign Up
                        </Link>
                    </p>
                )}
            </form>
        </div>
    );
};
