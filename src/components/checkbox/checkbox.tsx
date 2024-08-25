import React from "react";
import styles from "@/styles/components/Checkbox.module.css";

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, required = false }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      required={required}
      className={styles.checkboxInput}
    />
  );
};

export default Checkbox;
