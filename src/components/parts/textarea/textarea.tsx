import React from "react";
import styles from "@/styles/components/parts/textarea/Textarea.module.css";

interface TextareaProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  required?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  value,
  onChange,
  maxLength = 140,
  required = false,
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className={styles.textarea}
      required={required}
    />
  );
};

export default Textarea;
