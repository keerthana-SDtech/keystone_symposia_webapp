import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { signupSchema } from "../schemas";
import type { SignupFormValues } from "../schemas";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useTenant } from "../../../app/providers/TenantProvider";

export const SignupForm = () => {
    const { signup, isLoading, error } = useAuth();
    const { name, logo, logoWidth, logoHeight } = useTenant();

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: SignupFormValues) => {
        signup(values);
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
                <h2 className="text-[30px] font-bold text-[#111827] mb-3">Create Account</h2>
                <p className="text-[#6b7280] text-[14.5px]">
                    Join {name} to submit your scientific concepts
                </p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-[14px]">
                    {error}
                </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2 flex flex-col items-start">
                    <Label htmlFor="name" className="text-[14.5px] font-medium text-[#111827]">
                        Full Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        autoComplete="name"
                        placeholder="Enter your name"
                        {...form.register("name")}
                        className={`h-11 border-gray-200 focus:ring-primary focus:border-primary text-[14.5px] ${form.formState.errors.name ? 'border-red-500' : ''}`}
                    />
                    {form.formState.errors.name && (
                        <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

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
                        autoComplete="new-password"
                        placeholder="Create password"
                        {...form.register("password")}
                        className={`h-11 border-gray-200 focus:ring-primary focus:border-primary text-[14.5px] ${form.formState.errors.password ? 'border-red-500' : ''}`}
                    />
                    {form.formState.errors.password && (
                        <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-2 flex flex-col items-start">
                    <Label htmlFor="confirmPassword" className="text-[14.5px] font-medium text-[#111827]">
                        Confirm Password<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repeat password"
                        {...form.register("confirmPassword")}
                        className={`h-11 border-gray-200 focus:ring-primary focus:border-primary text-[14.5px] ${form.formState.errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {form.formState.errors.confirmPassword && (
                        <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:opacity-90 text-primary-foreground h-[46px] text-[15px] font-normal rounded-md shadow-sm hover:shadow-md transition-all mt-6"
                >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>

                <p className="text-center text-[14px] text-[#374151] mt-6">
                    Already have an account?{" "}
                    <Link to="/" className="text-primary font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
