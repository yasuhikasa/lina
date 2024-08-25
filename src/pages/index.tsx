import IndexTemplate from "@/components/templates/index";
import styles from "@/styles/Index.module.css";
import { NextPage } from "next";

const IndexPage: NextPage = () => {
  return (
    <IndexTemplate title="コーディング試験アプリ">
      <h1 className={styles.h1}>コーディング試験アプリ</h1>
    </IndexTemplate>
  );
};

export default IndexPage;
