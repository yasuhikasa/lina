import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../libs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import styles from "@/styles/components/Header.module.css";

const Header = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState<string | null>(null);
  const [profileIconUrl, setProfileIconUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || "名無しのユーザー");
          setProfileIconUrl(userData.profileIconUrl || "/default-profile.png");
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) return null;

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <Image
          src={profileIconUrl || "/default-profile.png"}
          alt={username || "ユーザー"}
          width={40}
          height={40}
          className={styles.profileIcon}
        />
        <p className={styles.username}>{username || "名無しのユーザー"}</p>
      </div>
    </header>
  );
};

export default Header;
