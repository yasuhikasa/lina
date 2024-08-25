import React from "react";
import styles from "@/styles/Select.module.css";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  required = false,
  className,
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      className={`${styles.select} ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
