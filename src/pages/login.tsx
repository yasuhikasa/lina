import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../libs/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "../styles/Login.module.css";
import Button from "../components/button/button";
import Input from "../components/input/input";
import { NextPage } from "next";

const Login: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        router.push("/posts");
      }, 1000);
    } catch (error) {
      console.error("ログインに失敗しました:", error);
      alert("ログインに失敗しました。");
      setEmail("");
      setPassword("");
    }
  };

  const navigateToSignup = () => {
    router.push("/signup");
  };

  return (
    <div className={styles.container}>
      {showPopup && (
        <div className={styles.popup}>
          <p>ログインが成功しました！</p>
        </div>
      )}
      <h1 className={styles.title}>ログイン</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          width="100%"
          required
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          width="100%"
          required
        />
        <Button
          text="ログイン"
          onClick={() => handleLogin}
        />
      </form>
      <p className={styles.signupText}>
        アカウントをお持ちでないですか？{" "}
        <span className={styles.signupLink} onClick={navigateToSignup}>
          サインアップ
        </span>
      </p>
    </div>
  );
};

export default Login;
