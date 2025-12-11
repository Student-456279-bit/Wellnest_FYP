import React from "react";

const Button = React.forwardRef(function Button(
  { children, type = "button", className = "", disabled = false, ...props },
  ref
) {
  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`btn-primary ${disabledClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
