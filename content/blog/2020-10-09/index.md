---
title: "Gatsby+Netlifyでブログ構築＆Typescript化"
date: "2020-10-09"
---

このブログの環境構築と、ハマったところについて覚書。

# 環境構築

- [Gatsby と Netlify で簡単にブログを作成 \- Qiita](https://qiita.com/k-penguin-sato/items/7554e5e7e90aa10ae225)
- [Gatsby\.js を完全 TypeScript 化する \- Qiita](https://qiita.com/Takepepe/items/144209f860fbe4d5e9bb)

gatsby-starter-blog では、`__PATH_PREFIX__`を使っている箇所があり、ここの型定義も追加する必要がある。

```typescript
// src/global.d.ts
declare const __PATH_PREFIX__: string
```

参考：[gatsby\-typescript \| Gatsby](https://www.gatsbyjs.com/plugins/gatsby-typescript/)  
※ 使っているのは gatsby-plugin-typescipt だけど、型定義のみここ参考に。

# `__PATH_PREFIX__` の型定義が反映されない

上記の通り、型定義ファイルを追加したのだが、VS Code 上で見ると
`Cannot find name '__PATH_PREFIX__'.` となる。  
ただし、型定義ファイルを開いた状態で`__PATH_PREFIX__`を使っているファイルを開くとこのエラーは消える。

原因は、tsconfig で型定義ファイルのディレクトリを include してなかったからだった。  
というか、そもそも tsconfig をおいてなかった。

下記の通り、tsconfig.json を設定した。

```
{
    "include": [
        "./types/**/*",
        "./src/**/*"
    ],
    "compilerOptions": {
        "target": "esnext",
        "module": "commonjs",
        "lib": [
            "dom",
            "es2017"
        ],
        "sourceMap": true,
        "noImplicitAny": true,
        "jsx": "react",
        "esModuleInterop": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "noEmit": true,
        "skipLibCheck": true,
    }
}
```

参考:

- [gatsby/tsconfig\.json at master · gatsbyjs/gatsby](https://github.com/gatsbyjs/gatsby/blob/master/examples/using-typescript/tsconfig.json)
  - module を`esnext`にすると import まわりでエラーが出ちゃったので、とりあえず commonjs にしてみた
