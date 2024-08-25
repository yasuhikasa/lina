import Head from "next/head";
import { useRouter } from "next/router";
import Button from "@/components/button/button";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  const navigateToSignup = () => {
    router.push("/signup");
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>コーディング試験アプリ</title>
        <meta name="description" content="コーディング試験アプリ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/heart.png" />
      </Head>
      <main className={styles.main}>
      <h1 className={styles.h1}>コーディング試験アプリ</h1>
        <div className={styles.buttonContainer}>
          <Button
            text="サインアップ"
            onClick={navigateToSignup}
            backgroundColor="#0070f3"
            color="#fff"
          />
          <Button
            text="サインイン"
            onClick={navigateToLogin}
            backgroundColor="#0070f3"
            color="#fff"
          />
        </div>
      </main>
    </>
  );
}
