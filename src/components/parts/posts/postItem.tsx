import React from "react";
import Image from "next/image";
import Button from "@/components/parts/button/button";
import styles from "@/styles/components/parts/posts/PostItem.module.css";

interface Post {
  id: string;
  content: string;
  uid: string;
  createdAt: any;
  username: string;
  profileIconUrl: string;
}

interface PostItemProps {
  post: Post;
  userUid: string | undefined;
  handleDelete: (postId: string, postUid: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, userUid, handleDelete }) => {
  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <Image
            src={post.profileIconUrl}
            alt={post.username}
            width={40}
            height={40}
            className={styles.profileIcon}
          />
          <p className={styles.username}>{post.username}</p>
        </div>
        {/* ログインユーザーの投稿の場合のみ削除ボタンを表示 */}
        {userUid === post.uid && (
          <Button
            text="削除"
            onClick={() => handleDelete(post.id, post.uid)}
            backgroundColor="#d3d3d3"
            color="#000"
            padding="0.3rem 0.5rem"
            margin="0"
            fontSize="0.8rem"
          />
        )}
      </div>
      <p className={styles.postContent}>{post.content}</p>
      <p className={styles.postTimestamp}>
        {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}{" "}
        {new Date(post.createdAt.seconds * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};

export default PostItem;
