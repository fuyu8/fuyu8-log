---
title: 【Gatsby】Storybook v6を導入する（「The result of this StaticQuery could not be fetched.」のエラー解決済み）
date: "2020-10-24"
tags: ["gatsby", "typescript", "storybook"]
---

これからブログのデザインをいじるのに、Storybook で作っていきたいので、導入します。  
[Visual Testing with Storybook \| Gatsby](https://www.gatsbyjs.com/docs/visual-testing-with-storybook/)  
なんと便利なことに、Storybook 導入についても Gatsby 公式にチュートリアルがあるので参考にします。  
ただし、Storybook v6 系には対応しておらず、最新の Gatsby と Storybook だとうまく動かないところがあったので、そのあたりを直します。

# 導入

まずはチュートリアル通りに Storybook をインストールします。

```
// init
$ npx -p @storybook/cli sb init
// 起動
$ npm run storybook
```

npm のバージョンが 5.2.0 以上であれば、npx が使えるので、チュートリアルの通りこれで OK。  
npx というのは、ローカルにインストールしたパッケージをかんたんに実行できるようにしたやつ。  
参考：[npm 5\.2\.0 の新機能！ 「npx」でローカルパッケージを手軽に実行しよう \- Qiita](https://qiita.com/tonkotsuboy_com/items/8227f5993769c3df533d)

 一旦これで、サンプルの stories が立ち上がります。

2020/10/19 時点で、storybook v6.0.26 がインストールされました。  
サンプルのファイルも tsx になってて、デフォルトで Typescript 推奨って感じになってますね。

# Gatsby 用の設定

チュートリアルを参考に、main.js と preview.js、package.json を直します。

```js
// .storybook/main.js
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  // ここから追記
  webpackFinal: async config => {
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]
    // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
    config.module.rules[0].use[0].loader = require.resolve("babel-loader")
    // use @babel/preset-react for JSX and env (instead of staged presets)
    config.module.rules[0].use[0].options.presets = [
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-env"),
    ]
    config.module.rules[0].use[0].options.plugins = [
      // use @babel/plugin-proposal-class-properties for class arrow functions
      require.resolve("@babel/plugin-proposal-class-properties"),
      // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
      require.resolve("babel-plugin-remove-graphql-queries"),
    ]

    // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
    config.resolve.mainFields = ["browser", "module", "main"]

    // === Typescriptで書く場合に必要な設定 ===
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", { flow: false, typescript: true }]],
        plugins: [
          require.resolve("@babel/plugin-proposal-class-properties"),
          // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
          require.resolve("babel-plugin-remove-graphql-queries"),
        ],
      },
    })
    config.resolve.extensions.push(".ts", ".tsx")
    // === Typescriptの場合に必要な設定 ここまで ===

    return config
  },
  // ここまで追記
}
```

```js
// .storybook/preview.js

// もともと設定されてた内容の下に、下記を追記

// Gatsby's Link overrides:
// Gatsby Link calls the `enqueue` & `hovering` methods on the global variable ___loader.
// This global object isn't set in storybook context, requiring you to override it to empty functions (no-op),
// so Gatsby Link doesn't throw any errors.
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
}
// This global variable is prevents the "__BASE_PATH__ is not defined" error inside Storybook.
global.__BASE_PATH__ = "/"
// Navigating through a gatsby app using gatsby-link or any other gatsby component will use the `___navigate` method.
// In Storybook it makes more sense to log an action than doing an actual navigate. Checkout the actions addon docs for more info: https://github.com/storybookjs/storybook/tree/master/addons/actions.
window.___navigate = pathname => {
  action("NavigateTo:")(pathname)
}
```

次に、staticQuery や useStaticQuery を使っている場合、チュートリアルによれば、package.json で storybook を立ち上げるときに`NODE_ENV=production`で立ち上げるようにと記載されています。  
これは、storybook 立ち上げ時に staticQuery などの記述を削除してくれるパッケージ、`babel-plugin-remove-graphql-queries`が production でないとうまく動かないためのようです。  
しかし、実際に設定してみたところ、`The result of this StaticQuery could not be fetched.` なるエラーが出てしまいました 😨  
色々調べたところ、最近の`babel-plugin-remove-graphql-queries`ではちょと設定が変わったっぽく、production では動かないそうです。  
参考：[\[Storybook\] useStaticQuery fetching fails when used inside stories · Issue \#26099 · gatsbyjs/gatsby](https://github.com/gatsbyjs/gatsby/issues/26099)  
こちらにちょうど解決方法が書いてあったので真似してみます。

package.json の scripts で、storybook 立ち上げ前に staticQuery のデータを storybook 用にコピーしておき、storybook は`NODE_ENV=test`で立ち上げます。

```json
// package.json
"scripts": {
    ...略...
    "copy-static-queries": "cp -r ./public/page-data/sq/d ./public/static",
    "prestorybook": "npm run copy-static-queries",
        "copy-static-queries": "cp -r ./public/page-data/sq/d ./public/static",
    "prestorybook": "npm run copy-static-queries",
    "storybook": "NODE_ENV=test start-storybook -p 6006 -s static",
    "build-storybook": "NODE_ENV=test build-storybook -s static"
  }
```

これで、staticQuery が含まれるコンポーネントの Stories も読み込まれるようになりました 🎉

今回の内容の作業ログ：[Storybook 導入 · fuyu8/fuyu8\-log@447930f](https://github.com/fuyu8/fuyu8-log/commit/447930fd0fba269a07994fb09b12cf4f6415b602)  
`sb init`で生成されたファイルが多いですが、今回編集したファイルは下記の通り。

- `.stories/`以下
- `package.json`
- `src/components/bio.stories.tsx`（staticQuery が含まれるコンポーネントのサンプル stories
  ）
