import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "../styles/Login.module.css";
import Button from "../components/button/button";
import { NextPage } from "next";

const Login: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false); // ポップアップの表示管理
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowPopup(true); // ポップアップを表示
      setTimeout(() => {
        setShowPopup(false); // ポップアップを非表示
        router.push("/posts"); // 投稿ページへ遷移
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
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <Button
          text="ログイン"
          onClick={() => handleLogin}
          backgroundColor="#0070f3"
          color="#fff"
          padding="0.75rem 1.5rem"
          fontSize="1rem"
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
