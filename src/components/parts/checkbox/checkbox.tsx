import React from "react";
import styles from "@/styles/components/parts/checkbox/Checkbox.module.css";

interface CheckboxProps {
  name?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  checked,
  onChange,
  required = false,
}) => {
  return (
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      required={required}
      className={styles.checkboxInput}
    />
  );
};

export default Checkbox;
