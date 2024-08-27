import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "@/libs/firebaseConfig";
import {
  addDoc,
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Modal from "@/components/parts/modal/modal";
import Header from "@/components/parts/header/header";
import Button from "@/components/parts/button/button";
import PostItem from "@/components/parts/posts/postItem";
import Textarea from "@/components/parts/textarea/textarea";
import styles from "@/styles/components/templates/Posts.module.css";
import { NextPage } from "next";

interface PostsProps {
  id: string;
  content: string;
  uid: string;
  createdAt: any;
  username: string;
  profileIconUrl: string;
}

const Posts: NextPage = () => {
  const [user, loading] = useAuthState(auth); // ユーザー情報を取得、認証状態も確認
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<PostsProps[]>([]);
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
          username: userData?.username,
          profileIconUrl: userData?.profileIconUrl,
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
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );
      const postsData = await getDocs(postsQuery);
      setPosts(
        postsData.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as PostsProps
        )
      );
    } catch (error) {
      console.error("投稿の取得に失敗しました:", error);
    }
  };

  // postId: 投稿ID, postUid: 投稿者のユーザーID
  // 投稿者のユーザーIDとログインユーザーのユーザーIDが一致する場合のみ削除可能
  const handleDelete = async (postId: string, postUid: string) => {
    if (user?.uid !== postUid) {
      alert("他のユーザーの投稿を削除することはできません。");
      return;
    }

    const confirmDelete = window.confirm(
      "本当にこの投稿を削除してよろしいですか？"
    );
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
      <div className={styles.newPostButtonContainer}>
        <Button text="新規投稿" onClick={() => setShowModal(true)} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="投稿内容"
            value={content}
            onChange={handleContentChange}
            maxLength={140}
            required
          />
          <Button
            text="投稿"
            type="submit"
            width="100%"
            margin="1rem 0 0 0"
            onClick={() => handleSubmit}
          />
        </form>
      </Modal>
      <div>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            userUid={user?.uid}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  ) : null;
};

export default Posts;
