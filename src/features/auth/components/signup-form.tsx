import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { JsonForms } from "@jsonforms/react";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";
import type { ErrorObject } from "ajv";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../../../components/ui/button";
import { customRenderers } from "../../../features/json-forms/renderers/renderers";
import { useTenant } from "../../../app/providers/TenantProvider";

interface SignupFormProps {
    schema: JsonSchema;
    uiSchema: UISchemaElement;
}

export const SignupForm = ({ schema, uiSchema }: SignupFormProps) => {
    const { signup, isLoading, error } = useAuth();
    const { name, logo, logoWidth, logoHeight } = useTenant();

    const [data, setData] = useState<Record<string, any>>({ name: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState<ErrorObject[]>([]);
    const [showErrors, setShowErrors] = useState(false);

    // Cross-field validation: password must match confirmPassword
    const additionalErrors: ErrorObject[] = useMemo(() => {
        if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
            return [{
                instancePath: "/confirmPassword",
                message: "Passwords don't match",
                schemaPath: "#/properties/confirmPassword",
                keyword: "custom",
                params: {},
            }];
        }
        return [];
    }, [data.password, data.confirmPassword]);

    const handleChange = ({ data: newData, errors: newErrors }: { data: any; errors: ErrorObject[] }) => {
        setData(newData ?? {});
        setErrors(newErrors ?? []);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowErrors(true);
        if (errors.length > 0 || additionalErrors.length > 0) return;
        signup({ name: data.name, email: data.email, password: data.password, confirmPassword: data.confirmPassword });
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

            <form onSubmit={handleSubmit} className="space-y-6">
                <JsonForms
                    schema={schema}
                    uischema={uiSchema}
                    data={data}
                    renderers={customRenderers}
                    onChange={handleChange}
                    additionalErrors={additionalErrors}
                    validationMode={showErrors ? "ValidateAndShow" : "ValidateAndHide"}
                />

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
};
