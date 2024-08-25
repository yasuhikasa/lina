import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../libs/firebaseConfig";
import Image from "next/image";
import styles from "@/styles/components/Header.module.css";

const Header = () => {
  const [user] = useAuthState(auth);

  if (!user) return null; // ユーザーがログインしていない場合は表示しない

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <Image
          src={user.photoURL || "/default-profile.png"} // Firebaseから取得したアイコンを表示
          alt={user.displayName || "ユーザー"}
          width={40}
          height={40}
          className={styles.profileIcon}
        />
        <p className={styles.username}>{user.displayName || "名無しのユーザー"}</p>
      </div>
    </header>
  );
};

export default Header;
