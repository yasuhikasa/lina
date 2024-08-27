import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { auth } from "@/libs/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from "@/components/button/button";
import styles from "@/styles/components/templates/Index.module.css";
import { NextPage } from "next";

interface IndexProps {
  title: string;
  children?: ReactNode;
}

const Index: NextPage<IndexProps> = ({ title, children }) => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth); // ユーザーの認証状態を取得

  useEffect(() => {
    if (loading) return;
    // userにはログインしているユーザー情報が入る
    // ユーザーがログインしている場合、postsページにリダイレクト
    if (user) {
      router.push("/posts");
    }
  }, [user, loading, router]);

  const navigateToSignup = () => {
    router.push("/signup");
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="コーディング試験アプリ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/heart.png" />
      </Head>
      <main className={styles.main}>
        {children}
        <div className={styles.buttonContainer}>
          <Button text="サインアップ" onClick={navigateToSignup} />
          <Button text="サインイン" onClick={navigateToLogin} />
        </div>
      </main>
    </>
  );
};

export default Index;
