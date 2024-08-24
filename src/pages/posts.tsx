import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebaseConfig";
import { addDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

interface Post {
  id: string;
  content: string;
  uid: string;
  createdAt: any;
}

const Post = () => {
  const [user] = useAuthState(auth);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.length > 140) {
      alert("投稿は140文字以内にしてください。");
      return;
    }
    try {
      await addDoc(collection(db, "posts"), {
        content,
        uid: user?.uid,
        createdAt: new Date(),
      });
      setContent("");
      fetchPosts(); // 投稿後に最新の投稿を再取得して表示
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

  useEffect(() => {
    fetchPosts(); // ページロード時に投稿を取得
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="投稿内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={140}
          required
        />
        <button type="submit">投稿</button>
      </form>

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <p>{post.content}</p>
            <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
            {/* {user?.uid === post.uid && (
              <button onClick={() => handleDelete(post.id)}>削除</button>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
