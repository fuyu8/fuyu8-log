---
title: 【Gatsby】blogにtagを追加する
date: "2020-10-11"
tags: ["gatsby", "typescript"]
---

タグつけられるようにしたいなーってことで、調べたら、そのまんまのチュートリアルがあった。  
参考：[Creating Tags Pages for Blog Posts \| Gatsby](https://www.gatsbyjs.com/docs/adding-tags-and-categories-to-blog-posts/)

こちらを参考に、タグごとの記事一覧ページを表示できるようになりました 🎉  
https://fuyu8.netlify.app/tags/gatsby

作業ログ： [tag を追加 · fuyu8/fuyu8\-log@53d2c7d](https://github.com/fuyu8/fuyu8-log/commit/53d2c7d6f9dd8457b1d628743341961ea92f022b)

# チュートリアルからの変更点

基本はチュートリアルに沿ってやったが、少し手直しした。

- Typescript 化した
  - 前の記事で紹介した TS 化と同じように、型定義などを追加
- 記事一覧の部分をコンポーネント化して、pages/index.ts と使い回せるようにした

# ハマったところ

`Uncaught Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.`  
というエラーが出た。
原因は、templates/tags.tsx で export するの忘れてた・・・。
凡ミスで無駄に時間使ってしまった。  
参考：[【Redux】これハマった。。invariant\.js:38 Uncaught Error: Element type is invalid: expected a string \(for built\-in components\) or a class/function \(for composite components\) but got: undefined\. \| 武骨日記](https://kenjimorita.jp/invariant-js38ncaught/)

# 宿題

https://fuyu8.netlify.app/tags/  
タグ一覧のページはチュートリアルのままでデザインとかしてないので、いつか直す。
