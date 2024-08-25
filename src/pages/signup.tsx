import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../libs/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../libs/firebaseConfig";
import { TERMS_URL } from "../libs/def";
import styles from "../styles/Signup.module.css";
import Input from "../components/input/input";
import Button from "../components/button/button";
import Checkbox from "../components/checkbox/checkbox";
import Select from "../components/select/select";
import FileInput from "../components/input/fileInput";
import { NextPage } from "next";

const Signup: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [profileIcon, setProfileIcon] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("パスワードは6文字以上である必要があります。");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profileIconUrl = "";
      if (profileIcon) {
        const storageRef = ref(storage, `profileIcons/${user.uid}`);
        await uploadBytes(storageRef, profileIcon);
        profileIconUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        birthdate,
        gender,
        profileIconUrl,
        agreedToTerms,
        createdAt: new Date(),
      });

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        router.push("/login");
      }, 2000);

    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("このメールアドレスはすでに使用されています。");
      } else if (error.code === "auth/invalid-email") {
        alert("無効なメールアドレスです。");
      } else {
        console.error("ユーザー登録に失敗しました:", error);
        alert("ユーザー登録に失敗しました。");
      }
    }
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ユーザー登録</h1>
      {showPopup && (
        <div className={styles.popup}>
          <p>ユーザー登録が完了しました！</p>
        </div>
      )}
      <form onSubmit={handleSignup} className={styles.form}>
        <Input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="date"
          placeholder="生年月日"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <Select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          options={[
            { value: "", label: "性別を選択" },
            { value: "male", label: "男性" },
            { value: "female", label: "女性" },
          ]}
          required
        />
        <FileInput
          onChange={(file) => setProfileIcon(file)}
          accept="image/*"
          required
        />
        <label>
        <Checkbox
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          required
        />
          <span>
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              利用規約
            </a>
            に同意します
          </span>
        </label>
        <Button text="サインアップ" margin="1rem 0 0 0" onClick={() =>handleSignup} />
      </form>
      <p className={styles.loginText}>
        すでにアカウントをお持ちですか？{" "}
        <span className={styles.loginLink} onClick={navigateToLogin}>
          ログイン
        </span>
      </p>
    </div>
  );
};

export default Signup;

