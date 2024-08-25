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
  margin = "0",
  padding,
  fontSize,
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.button}
      style={{
        color,
        backgroundColor,
        margin,
        "--padding": padding,
        "--fontSize": fontSize,
      } as React.CSSProperties}
    >
      {text}
    </button>
  );
};

export default Button;
