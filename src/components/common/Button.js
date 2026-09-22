const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const variants = {
    primary:
      "bg-[#0256b1] text-white hover:bg-[#01438a] active:bg-[#01376f] shadow-sm",

    secondary:
      "bg-[#eaf2fb] text-[#0256b1] hover:bg-[#dceafb] border border-[#c9dcf5]",

    outline:
      "border border-[#0256b1] text-[#0256b1] hover:bg-[#f4f8fd]",

    ghost:
      "text-[#0256b1] hover:bg-[#f4f8fd]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-6 py-2.5 rounded-xl",
    lg: "px-8 py-3 rounded-xl text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className} ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-[1.02] active:scale-[0.98]"
      }`}
    >
      {Icon && iconPosition === "left" && <Icon size={18} />}

      {children}

      {Icon && iconPosition === "right" && <Icon size={18} />}
    </button>
  );
};

export default Button;