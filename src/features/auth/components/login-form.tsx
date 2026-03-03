import { useState } from "react";
import { Link } from "react-router-dom";
import { JsonForms } from "@jsonforms/react";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";
import type { ErrorObject } from "ajv";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { customRenderers } from "../../../features/json-forms/renderers/renderers";
import { useTenant } from "../../../app/providers/TenantProvider";

interface LoginFormProps {
    schema: JsonSchema;
    uiSchema: UISchemaElement;
}

export const LoginForm = ({ schema, uiSchema }: LoginFormProps) => {
    const { login, isLoading, error } = useAuth();
    const { name, logo, logoWidth, logoHeight } = useTenant();

    const [data, setData] = useState<Record<string, any>>({ email: "", password: "" });
    const [errors, setErrors] = useState<ErrorObject[]>([]);
    const [rememberMe, setRememberMe] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    const handleChange = ({ data: newData, errors: newErrors }: { data: any; errors: ErrorObject[] }) => {
        setData(newData ?? {});
        setErrors(newErrors ?? []);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowErrors(true);
        if (errors.length > 0) return;
        login({ email: data.email, password: data.password, rememberMe });
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

            <form onSubmit={handleSubmit} className="space-y-6">
                <JsonForms
                    schema={schema}
                    uischema={uiSchema}
                    data={data}
                    renderers={customRenderers}
                    onChange={handleChange}
                    validationMode={showErrors ? "ValidateAndShow" : "ValidateAndHide"}
                />

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="rememberMe"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                            className="w-[18px] h-[18px] border-gray-300 rounded-[4px] data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="rememberMe" className="text-[14px] text-[#374151] cursor-pointer font-normal">
                            Remember Me
                        </Label>
                    </div>
                    <Link to="/forgot-password" className="text-[14px] font-medium text-primary hover:underline">
                        Forget Password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:opacity-90 text-primary-foreground h-[46px] text-[15px] font-normal rounded-md shadow-sm hover:shadow-md transition-all mt-6"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </Button>

                <p className="text-center text-[14px] text-[#374151] mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary font-medium hover:underline">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
};
