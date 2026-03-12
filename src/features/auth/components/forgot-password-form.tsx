import { useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { useTenant } from "../../../hooks/useTenant";

const OTP_LENGTH = 6;

export const ForgotPasswordForm = () => {
    const { name, logo, logoDark, logoWidth, logoHeight } = useTenant();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        const updated = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((char, i) => { updated[i] = char; });
        setOtp(updated);
        const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[nextFocus]?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < OTP_LENGTH) return;
        setIsLoading(true);
        // TODO: wire up to password reset API
        setTimeout(() => setIsLoading(false), 1500);
    };

    const handleResend = () => {
        // TODO: wire up resend OTP API
    };

    return (
        <div className="w-full max-w-[460px] mx-auto">
            <div className="flex flex-col items-center text-center mb-10">
                <img
                    src={logoDark ?? logo}
                    alt={name}
                    style={{ width: logoWidth, height: logoHeight }}
                    className="mb-10 object-contain"
                />
                <h2 className="text-[36px] font-semibold text-[#111827] mb-3">
                    Forgot Password
                </h2>
                <p className="text-[#6b7280] text-[15px]">
                    Enter the OTP received in your email to change password.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="flex justify-center gap-3 mb-8">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
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
                    onClick={handleResend}
                    className="text-primary font-medium hover:underline"
                >
                    Resend Code
                </button>
            </p>
        </div>
    );
};
