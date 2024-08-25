import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../libs/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../libs/firebaseConfig";
import styles from "../styles/Signup.module.css";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [profileIcon, setProfileIcon] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false); // ポップアップの表示状態を管理

  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("パスワードは6文字以上である必要があります。");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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

      setShowPopup(true); // ポップアップを表示

      setTimeout(() => {
        setShowPopup(false); // ポップアップを非表示
        router.push("/login"); // ログイン画面に遷移
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

  return (
    <div>
      {showPopup && (
        <div className={styles.popup}>
          <p>ユーザー登録が完了しました！</p>
        </div>
      )}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <input
          type="date"
          placeholder="生年月日"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">性別を選択</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) =>
            setProfileIcon(e.target.files ? e.target.files[0] : null)
          }
          accept="image/*"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            required
          />
          <a
            href={process.env.NEXT_PUBLIC_TERMS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            利用規約に同意します
          </a>
        </label>
        <button type="submit">サインアップ</button>
      </form>
    </div>
  );
};

export default Signup;

