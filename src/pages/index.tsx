import IndexTemplate from "@/components/templates/index";
import styles from "@/styles/pages/Index.module.css";
import { NextPage } from "next";

const IndexPage: NextPage = () => {
  return (
    <IndexTemplate title="文章投稿アプリ">
      <h1 className={styles.h1}>文章投稿アプリ</h1>
    </IndexTemplate>
  );
};

export default IndexPage;
