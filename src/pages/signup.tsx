import { useState } from "react";
import { auth, db, analytics } from '../lib/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebaseConfig";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [profileIcon, setProfileIcon] = useState<File | null>(null); // プロフィールアイコン
  const [agreedToTerms, setAgreedToTerms] = useState(false); // 利用規約への同意

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("パスワードは6文字以上である必要があります。");
      return;
    }

    if (!agreedToTerms) {
      alert("利用規約に同意してください。");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profileIconUrl = "";
      if (profileIcon) {
        // プロフィールアイコンをFirebase Storageにアップロード
        const storageRef = ref(storage, `profileIcons/${user.uid}`);
        await uploadBytes(storageRef, profileIcon);
        profileIconUrl = await getDownloadURL(storageRef);
      }

      // Firestoreにユーザー情報を保存
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        birthdate,
        gender,
        profileIconUrl, // プロフィールアイコンのURLを保存
        createdAt: new Date(),
      });

      alert("ユーザー登録が完了しました！");
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
    <form onSubmit={handleSignup}>
      <input type="text" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="date" placeholder="生年月日" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
      <select value={gender} onChange={(e) => setGender(e.target.value)} required>
        <option value="">性別を選択</option>
        <option value="male">男性</option>
        <option value="female">女性</option>
        <option value="other">その他</option>
      </select>
      <input type="file" onChange={(e) => setProfileIcon(e.target.files ? e.target.files[0] : null)} accept="image/*" required />
      <label>
        <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} required />
        <a href="https://www.notion.so/a714620bbd8740d1ac98f2326fbd0bbc?pvs=21" target="_blank" rel="noopener noreferrer">
          利用規約に同意します
        </a>
      </label>
      <button type="submit">サインアップ</button>
    </form>
  );
};

export default Signup;
