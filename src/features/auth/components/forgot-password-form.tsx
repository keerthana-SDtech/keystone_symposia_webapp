import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { useTenant } from "../../../hooks/useTenant";
import { authApi } from "../api";

const OTP_LENGTH = 6;

type Step = "email" | "otp" | "reset";

export const ForgotPasswordForm = () => {
    const { name, logo, logoWidth, logoHeight } = useTenant();
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        const updated = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((char, i) => { updated[i] = char; });
        setOtp(updated);
        const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[nextFocus]?.focus();
    };

    const sendOtp = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authApi.forgotPassword(email);
        } catch {
            // Silently succeed regardless — don't reveal whether email exists
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        await sendOtp();
        setStep("otp");
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < OTP_LENGTH) return;
        setIsLoading(true);
        setError(null);
        try {
            const valid = await authApi.validateOtp(email, code);
            if (!valid) {
                setError("Invalid or expired OTP. Please check your email and try again.");
                return;
            }
            setStep("reset");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await authApi.resetPassword(email, otp.join(""), password);
            navigate("/");
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Invalid or expired OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const Logo = (
        <img
            src={logo}
            alt={name}
            style={{ width: logoWidth, height: logoHeight }}
            className="mb-10 object-contain"
        />
    );

    // ── Step 1: Email ─────────────────────────────────────────────────────────
    if (step === "email") {
        return (
            <div className="w-full max-w-[460px] mx-auto">
                <div className="flex flex-col items-center text-center mb-10">
                    {Logo}
                    <h2 className="text-[36px] font-semibold text-[#111827] mb-3">
                        Forgot Password
                    </h2>
                    <p className="text-[#6b7280] text-[15px]">
                        Enter your email address and we'll send you a one-time code.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-[14px]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[14px] font-medium text-[#374151]">
                            Email Address<span className="text-red-500">*</span>
                        </Label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full h-[48px] px-4 border border-gray-300 rounded-lg text-[15px] text-[#111827] placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full bg-primary hover:opacity-90 text-primary-foreground h-[48px] text-[16px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        {isLoading ? "Sending..." : "Continue"}
                    </Button>
                </form>

                <p className="text-center text-[14px] text-[#374151] mt-6">
                    Didn't receive code?{" "}
                    <button
                        type="button"
                        onClick={async () => { if (email) await sendOtp(); }}
                        className="text-primary font-medium hover:underline"
                    >
                        Resend Code
                    </button>
                </p>
            </div>
        );
    }

    // ── Step 2: OTP ───────────────────────────────────────────────────────────
    if (step === "otp") {
        return (
            <div className="w-full max-w-[460px] mx-auto">
                <div className="flex flex-col items-center text-center mb-10">
                    {Logo}
                    <h2 className="text-[36px] font-semibold text-[#111827] mb-3">
                        Forgot Password
                    </h2>
                    <p className="text-[#6b7280] text-[15px]">
                        Enter the OTP received in your email to change password.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-[14px]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleOtpSubmit}>
                    <div className="flex justify-center gap-3 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                onPaste={handleOtpPaste}
                                className="w-[52px] h-[52px] text-center text-[20px] font-medium border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white text-[#111827]"
                            />
                        ))}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || otp.join("").length < OTP_LENGTH}
                        className="w-full bg-primary hover:opacity-90 text-primary-foreground h-[48px] text-[16px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        {isLoading ? "Verifying..." : "Continue"}
                    </Button>
                </form>

                <p className="text-center text-[14px] text-[#374151] mt-6">
                    Didn't receive code?{" "}
                    <button
                        type="button"
                        onClick={async () => { setOtp(Array(OTP_LENGTH).fill("")); await sendOtp(); }}
                        className="text-primary font-medium hover:underline"
                    >
                        Resend Code
                    </button>
                </p>
            </div>
        );
    }

    // ── Step 3: Reset Password ────────────────────────────────────────────────
    return (
        <div className="w-full max-w-[460px] mx-auto">
            <div className="flex flex-col items-center text-center mb-10">
                {Logo}
                <h2 className="text-[36px] font-semibold text-[#111827] mb-3">
                    Reset Password
                </h2>
                <p className="text-[#6b7280] text-[15px]">
                    Choose a new password for your account.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-[14px]">
                    {error}
                </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-[14px] font-medium text-[#374151]">
                        Password<span className="text-red-500">*</span>
                    </Label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full h-[48px] px-4 border border-gray-300 rounded-lg text-[15px] text-[#111827] placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[14px] font-medium text-[#374151]">
                        Confirm Password<span className="text-red-500">*</span>
                    </Label>
                    <input
                        id="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full h-[48px] px-4 border border-gray-300 rounded-lg text-[15px] text-[#111827] placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                    <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="w-[18px] h-[18px] border-gray-300 rounded-[4px] data-[state=checked]:bg-primary"
                    />
                    <Label
                        htmlFor="rememberMe"
                        className="text-[14px] text-[#374151] cursor-pointer font-normal"
                    >
                        Remember Me
                    </Label>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !password || !confirmPassword}
                    className="w-full bg-primary hover:opacity-90 text-primary-foreground h-[48px] text-[16px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                    {isLoading ? "Resetting..." : "Continue"}
                </Button>
            </form>

            <p className="text-center text-[14px] text-[#374151] mt-6">
                Already have an account?{" "}
                <Link to="/" className="text-primary font-medium hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
};
