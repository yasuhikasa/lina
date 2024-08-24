import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebaseConfig";
import { addDoc, collection, query, orderBy, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from 'next/image';
import styles from '../styles/Posts.module.css';

interface Post {
  id: string;
  content: string;
  uid: string;
  createdAt: any;
  username: string;
  profileIconUrl: string;
}

const Post = () => {
  const [user] = useAuthState(auth);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

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
        fetchPosts(); // 投稿後に最新の投稿を再取得して表示
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
      return; // キャンセル時は処理を中断
    }

    try {
      await deleteDoc(doc(db, "posts", postId));
      fetchPosts(); // 削除後に最新の投稿を再取得して表示
    } catch (error) {
      console.error("投稿の削除に失敗しました:", error);
      alert("投稿の削除に失敗しました。");
    }
  };

  useEffect(() => {
    fetchPosts(); // ページロード時に投稿を取得
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="投稿内容"
          value={content}
          onChange={handleContentChange}
          maxLength={140}
          required
        />
        <button type="submit">投稿</button>
      </form>

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
  );
};

export default Post;
