import React from "react";
import styles from "@/styles/Button.module.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  fontSize?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  color = "#fff",
  backgroundColor = "#0070f3",
  padding = "0.75rem 1.5rem",
  fontSize = "1rem",
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.button}
      style={{ color, backgroundColor, padding, fontSize }}
    >
      {text}
    </button>
  );
};

export default Button;
