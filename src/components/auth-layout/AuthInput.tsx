export interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  hasError?: boolean;
}

export function AuthInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = true,
  minLength,
  hasError = false,
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-colors"
        style={{
          background: "var(--input)",
          borderColor: hasError ? "var(--bear)" : "var(--input-border)",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
}
