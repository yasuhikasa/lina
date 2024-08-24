import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "../styles/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false); // ポップアップの表示管理
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowPopup(true); // ポップアップを表示
      setTimeout(() => {
        setShowPopup(false); // ポップアップを非表示
        router.push("/post"); // ページ遷移
      }, 1000);
    } catch (error) {
      console.error("ログインに失敗しました:", error);
      alert("ログインに失敗しました。");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div>
      {showPopup && (
        <div className={styles.popup}>
          <p>ログインが成功しました！</p>
        </div>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default Login;
