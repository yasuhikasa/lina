import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../libs/firebaseConfig";
import { addDoc, collection, query, orderBy, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from 'next/image';
import styles from '../styles/Posts.module.css';
import modalStyles from '../styles/components/Modal.module.css';
import Modal from '../components/modal/modal';
import Header from '../components/header/header';

interface Post {
  id: string;
  content: string;
  uid: string;
  createdAt: any;
  username: string;
  profileIconUrl: string;
}

const Post = () => {
  const [user, loading] = useAuthState(auth); // ユーザー情報を取得、認証状態も確認
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // ログインしていない場合、トップページにリダイレクト
      router.push("/");
    }
  }, [user, loading, router]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputContent = e.target.value;
    if (inputContent.length > 140) {
      alert("投稿は140文字以内にしてください。");
      return;
    }
    setContent(inputContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userDoc = await getDoc(doc(db, "users", user?.uid || ""));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        await addDoc(collection(db, "posts"), {
          content,
          uid: user?.uid,
          username: userData?.username || "名無しのユーザー",
          profileIconUrl: userData?.profileIconUrl || "/default-profile.png",
          createdAt: new Date(),
        });

        setContent("");
        setShowModal(false);
        fetchPosts();
      } else {
        alert("ユーザー情報が見つかりません。再度ログインしてください。");
      }
    } catch (error) {
      console.error("投稿に失敗しました:", error);
      alert("投稿に失敗しました。");
    }
  };

  const fetchPosts = async () => {
    try {
      const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const postsData = await getDocs(postsQuery);
      setPosts(postsData.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post)));
    } catch (error) {
      console.error("投稿の取得に失敗しました:", error);
    }
  };

  const handleDelete = async (postId: string, postUid: string) => {
    if (user?.uid !== postUid) {
      alert("他のユーザーの投稿を削除することはできません。");
      return;
    }

    const confirmDelete = window.confirm("本当にこの投稿を削除してよろしいですか？");
    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDoc(doc(db, "posts", postId));
      fetchPosts();
    } catch (error) {
      console.error("投稿の削除に失敗しました:", error);
      alert("投稿の削除に失敗しました。");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return user ? (
    <div>
      <Header />
      <button onClick={() => setShowModal(true)}>新規投稿</button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="投稿内容"
            value={content}
            onChange={handleContentChange}
            maxLength={140}
            className={modalStyles.textarea}
            required
          />
          <button type="submit" className={modalStyles.button}>投稿</button>
        </form>
      </Modal>

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image
                src={post.profileIconUrl}
                alt={post.username}
                width={40}
                height={40}
                className={styles.profileIcon}
              />
              <p>{post.username}</p>
            </div>
            <p>{post.content}</p>
            <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
            {user?.uid === post.uid && (
              <button onClick={() => handleDelete(post.id, post.uid)}>削除</button>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default Post;
