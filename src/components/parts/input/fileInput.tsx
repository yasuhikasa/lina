import React, { useRef } from "react";
import styles from "@/styles/components/parts/input/Input.module.css";

interface FileInputProps {
  onChange: (file: File | null) => void;
  required?: boolean;
  accept?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  onChange,
  required = false,
  accept,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onChange(file);
  };

  return (
    <input
      type="file"
      onChange={handleChange}
      required={required}
      accept={accept}
      ref={fileInputRef}
      className={styles.input}
      data-testid="file-input"
    />
  );
};

export default FileInput;
