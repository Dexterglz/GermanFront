type BadgeProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger";
};

export function Badge({ children, variant = "primary" }: BadgeProps) {
  const getColor = () => {
    switch (variant) {
      case "secondary":
        return "#6b7280";
      case "success":
        return "#16a34a";
      case "danger":
        return "#dc2626";
      default:
        return "#2563eb";
    }
  };

  return (
    <span
      style={{
        backgroundColor: getColor(),
        color: "white",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {children}
    </span>
  );
}