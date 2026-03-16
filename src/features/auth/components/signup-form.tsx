import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { JsonForms } from "@jsonforms/react";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";
import type { ErrorObject } from "ajv";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../../../components/ui/button";
import { customRenderers } from "../../../features/json-forms/renderers/renderers";
import { useTenant } from "../../../hooks/useTenant";
import { SIGNUP_PAGE_CONTENT } from "../../../pages/signup/data/signupPageData";

interface SignupFormProps {
  schema: JsonSchema;
  uiSchema: UISchemaElement;
}

export const SignupForm = ({ schema, uiSchema }: SignupFormProps) => {
  const { signup, isLoading, error } = useAuth();
  const { name, logo, logoWidth, logoHeight } = useTenant();

  const [data, setData] = useState<Record<string, any>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const additionalErrors: ErrorObject[] = useMemo(() => {
    const errs: ErrorObject[] = [];

    if (data.password && data.password.length < 8) {
      errs.push({
        instancePath: "/password",
        message: "Password must be at least 8 characters",
        schemaPath: "#/properties/password",
        keyword: "custom",
        params: {},
      });
    }

    if (data.confirmPassword && data.confirmPassword.length < 8) {
      errs.push({
        instancePath: "/confirmPassword",
        message: "Password must be at least 8 characters",
        schemaPath: "#/properties/confirmPassword",
        keyword: "custom",
        params: {},
      });
    }

    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      errs.push({
        instancePath: "/confirmPassword",
        message: "Passwords don't match",
        schemaPath: "#/properties/confirmPassword",
        keyword: "custom",
        params: {},
      });
    }

    return errs;
  }, [data.password, data.confirmPassword]);

  const handleChange = ({
    data: newData,
    errors: newErrors,
  }: {
    data: any;
    errors: ErrorObject[];
  }) => {
    setData(newData ?? {});
    setErrors(newErrors ?? []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (errors.length > 0 || additionalErrors.length > 0) return;

    signup({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <img
          src={logo}
          alt={name}
          style={{ width: logoWidth, height: logoHeight }}
          className="mb-10 object-contain"
        />

        <h2 className="text-[36px] font-semibold text-[#111827] mb-3">
          {SIGNUP_PAGE_CONTENT.heading}
        </h2>

        <p className="text-[#6b7280] text-[15px]">
          {SIGNUP_PAGE_CONTENT.subheadingPrefix}
          {name}
          {SIGNUP_PAGE_CONTENT.subheadingSuffix}
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
          className="w-full bg-primary hover:opacity-90 text-primary-foreground h-[48px] text-[16px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all mt-6"
        >
          {isLoading
            ? SIGNUP_PAGE_CONTENT.signUpButtonLoading
            : SIGNUP_PAGE_CONTENT.signUpButton}
        </Button>

        <p className="text-center text-[14px] text-[#374151] mt-6">
          {SIGNUP_PAGE_CONTENT.alreadyHaveAccount}{" "}
          <Link
            to="/"
            className="text-primary font-medium hover:underline"
          >
            {SIGNUP_PAGE_CONTENT.loginLink}
          </Link>
        </p>
      </form>
    </div>
  );
};