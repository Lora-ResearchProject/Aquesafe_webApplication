export const Select = ({
  children,
  onValueChange,
  disabled,
  value,
  className = "",
}) => (
  <div className={`relative ${className}`}>
    <select
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      value={value}
      className="w-full p-3 border rounded-md bg-white focus:outline-none focus:ring"
    >
      {children}
    </select>
  </div>
);

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
