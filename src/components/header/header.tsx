import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../libs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/components/Header.module.css";

const Header = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState<string>();
  const [profileIconUrl, setProfileIconUrl] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username);
          setProfileIconUrl(userData.profileIconUrl);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    const confirmed = window.confirm("ログアウトしてもよろしいですか？");
    if (confirmed) {
      await signOut(auth);
      router.push("/");
    }
  };

  if (!user) return null;

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <Image
          src={profileIconUrl || ""}
          alt={username || ""}
          width={40}
          height={40}
          className={styles.profileIcon}
        />
        <p className={styles.username}>{username}</p>
      </div>
      <a className={styles.logoutLink} onClick={handleLogout}>
        ログアウト
      </a>
    </header>
  );
};

export default Header;
