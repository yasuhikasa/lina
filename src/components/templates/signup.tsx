import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../libs/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/libs/firebaseConfig";
import { TERMS_URL } from "@/libs/def";
import styles from "@/styles/components/templates/Signup.module.css";
import Input from "@/components/parts/input/input";
import Button from "@/components/parts/button/button";
import Checkbox from "@/components/parts/checkbox/checkbox";
import Select from "@/components/parts/select/select";
import FileInput from "@/components/parts/input/fileInput";
import { NextPage } from "next";

interface SignupProps {
  email: string;
  password: string;
  username: string;
  birthdate: string;
  gender: string;
  profileIcon: File | null;
  agreedToTerms: boolean;
}

const Signup: NextPage = () => {
  const [formState, setFormState] = useState<SignupProps>({
    email: "",
    password: "",
    username: "",
    birthdate: "",
    gender: "",
    profileIcon: null,
    agreedToTerms: false,
  });

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [user, loading] = useAuthState(auth);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // サインアップ中の場合は何もしない
    if (loading || isSigningUp) return;
    // ユーザーがログイン状態の場合、postsページにリダイレクト
    // サインアップ完了後もログイン状態になるため、postsページにリダイレクト
    if (user) {
      setTimeout(() => {
        router.push("/posts");
      }, 1500); // 1.5秒遅延させてから遷移(ポップアップ表示のため)
    }
  }, [user, loading, isSigningUp, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (file: File | null) => {
    setFormState((prevState) => ({
      ...prevState,
      profileIcon: file,
    }));
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);

    if (formState.password.length < 6) {
      alert("パスワードは6文字以上である必要があります。");
      setIsSigningUp(false); // エラーが発生した場合はサインアップ状態を解除
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formState.email,
        formState.password
      );
      const user = userCredential.user;

      let profileIconUrl = "";
      if (formState.profileIcon) {
        const storageRef = ref(storage, `profileIcons/${user.uid}`);
        await uploadBytes(storageRef, formState.profileIcon);
        profileIconUrl = await getDownloadURL(storageRef);
      }

      // user.uidをドキュメントIDとしてusersコレクションにユーザー情報を保存
      await setDoc(doc(db, "users", user.uid), {
        username: formState.username,
        email: formState.email,
        birthdate: formState.birthdate,
        gender: formState.gender,
        profileIconUrl,
        agreedToTerms: formState.agreedToTerms,
        createdAt: new Date(),
      });

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        setIsSigningUp(false);
      }, 1000); // 1秒後にポップアップを非表示にする
    } catch (error: any) {
      setIsSigningUp(false); // エラーが発生した場合はサインアップ状態を解除
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
          name="username"
          placeholder="ユーザー名"
          value={formState.username}
          onChange={handleInputChange}
          maxLength={20}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="メールアドレス"
          value={formState.email}
          onChange={handleInputChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="パスワード"
          value={formState.password}
          onChange={handleInputChange}
          required
        />
        <Input
          type="date"
          name="birthdate"
          placeholder="生年月日"
          value={formState.birthdate}
          onChange={handleInputChange}
          required
        />
        <Select
          value={formState.gender}
          onChange={(value) => setFormState({ ...formState, gender: value })}
          options={[
            { value: "", label: "性別を選択" },
            { value: "male", label: "男性" },
            { value: "female", label: "女性" },
          ]}
          required
        />
        <FileInput onChange={handleFileChange} accept="image/*" required />
        <label>
          <Checkbox
            name="agreedToTerms"
            checked={formState.agreedToTerms}
            onChange={handleInputChange}
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
        <Button
          text="サインアップ"
          type="submit"
          margin="1rem 0 0 0"
          onClick={() => handleSignup}
        />
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
