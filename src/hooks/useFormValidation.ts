import { useState, useCallback } from "react";

interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

interface ValidationRules {
  [field: string]: ValidationRule[];
}

// TO DO: Remover o tipo Any
export function useFormValidation<T extends Record<string, any>>(rules: ValidationRules) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (field: keyof T, value: string) => {
      const fieldRules = rules[field as string];
      if (!fieldRules) return "";

      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          return rule.message;
        }
      }

      return "";
    },
    [rules]
  );

  const validateForm = useCallback(
    (data: T) => {
      const newErrors: Partial<Record<keyof T, string>> = {};
      let isValid = true;

      Object.keys(rules).forEach((field) => {
        const error = validateField(field as keyof T, data[field]);
        if (error) {
          newErrors[field as keyof T] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [rules, validateField]
  );

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    handleBlur,
  };
}
