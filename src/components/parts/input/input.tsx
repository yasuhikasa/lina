import React from "react";
import styles from "@/styles/components/parts/input/Input.module.css";

interface InputProps {
  type: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  width?: string;
  checked?: boolean;
  name?: string;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder = "",
  value = "",
  onChange,
  required = false,
  width = "100%",
  checked,
  name,
  maxLength,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={styles.input}
      style={{ width }}
      checked={checked}
      name={name}
      maxLength={maxLength}
    />
  );
};

export default Input;
