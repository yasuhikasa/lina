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
  width?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  color = "#fff",
  backgroundColor = "#0070f3",
  margin = "0",
  padding,
  fontSize,
  width = "auto",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={styles.button}
      style={{
        color,
        backgroundColor,
        margin,
        "--padding": padding,
        "--fontSize": fontSize,
        width,
      } as React.CSSProperties}
    >
      {text}
    </button>
  );
};

export default Button;
