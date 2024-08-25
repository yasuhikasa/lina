import React from "react";
import styles from "@/styles/components/Button.module.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  color?: string;
  backgroundColor?: string;
  margin?: string;
  padding?: string;
  fontSize?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  color = "#fff",
  backgroundColor = "#0070f3",
  padding = "0.75rem 1.5rem",
  margin = "0",
  fontSize = "1rem",
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.button}
      style={{ color, backgroundColor, margin, padding, fontSize }}
    >
      {text}
    </button>
  );
};

export default Button;
