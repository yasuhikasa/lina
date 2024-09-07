## アプリの概要

新規登録・ログインの機能があり、ログインしたユーザーのみが文章を投稿できるWebアプリ

## アプリの仕様書（画面仕様書）

https://docs.google.com/spreadsheets/d/1OgvUJpd_rcyU9YY--0bgzVJFcywfra9GcWqnZ-Rb4sY/edit?usp=sharing

## 使用技術

フロントエンド

・next.js

・TypeScript

バックエンド、DB、認証

・Firebase

認証にはFirebase Authentication, データベースにはFirestoreを使用

テストコード

・jest

```bash
npm test
```

## アプリのURL（vercelでデプロイ済み）

URL: https://luna-self.vercel.app/

```bash
テストアカウント（ご自由にお使いください）
ユーザー名：78@hoge.co.jp
パスワード：aaaaaa
```

## 開発環境

```bash
docker-compose build
docker-compose up
```

http://localhost:3000/
