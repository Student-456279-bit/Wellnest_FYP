import React, { useState, forwardRef } from "react";

const PasswordField = forwardRef(function PasswordField(
  { label, name, value, onChange, className = "", placeholder = "", id, autoComplete, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id || name} className="text-sm text-slate-600">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id || name}
          name={name}
          ref={ref}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${className} pr-14`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-600 px-2 py-1 rounded"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
});

PasswordField.displayName = "PasswordField";
export default PasswordField;
