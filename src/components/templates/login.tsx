import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../libs/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "@/styles/components/templates/Login.module.css";
import Button from "../parts/button/button";
import Input from "../parts/input/input";
import { NextPage } from "next";

const Login: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, loading] = useAuthState(auth); // ユーザーの認証状態を取得
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      // ユーザーがログインしている場合、postsページにリダイレクト
      router.push("/posts");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/posts");
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
        <Button text="ログイン" type="submit" onClick={() => handleLogin} />
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
