---
title: 【Gatsby】Storybookでcss modulesを使えるようにする
date: "2020-11-04"
tags: ["gatsby", "typescript", "storybook"]
---

前回、Storybook が立ち上がるところまでやりました。  
ところが、css modules で書いたコンポーネントで、css がうまく適用されない！  
Gatsby のルールでは、css modules を使うときは、`xxx.modules.css`にするのですが、これを読み込めるように webpack の設定を直していきます。

.storybook/main.js に以下を追加します。

```js
module.exports = {
...
  webpackFinal: async config => {
    ...
    // ここから
    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        require.resolve("style-loader"),
        {
          loader: require.resolve("css-loader"),
          options: {
            importLoaders: 1,
            modules: {
              modules: true,
              localIdentName: "[path][name]__[local]--[hash:base64:5]",
              context: path.resolve(__dirname, "src"),
            },
          },
        },
      ],
    })
    // ここまで
    ...
    return config
  },
}
```

これで storybook を起動すると、以下のようなエラーが出てしまいました・・・

```sh
ERROR in ./src/components/header/index.module.css (./node_modules/@storybook/core/node_modules/css-loader/dist/cjs.js??ref--11-1!./node_modules/postcss-loader/src??postcss!./node_modules/style-loader!./node_modules/css-loader??ref--14-1!./src/components/header/index.module.css)
Module build failed (from ./node_modules/postcss-loader/src/index.js):
SyntaxError

(2:1) Unknown word

  1 |
> 2 | var content = require("!!../../../node_modules/css-loader/index.js??ref--14-1!./index.module.css");
    | ^
  3 |
  4 | if(typeof content === 'string') content = [[module.id, content, '']];
```

原因は、css を複数回 loader にかけてしまっているためだそうです。  
実際、main.js の適当な箇所に`console.log(config.module.rules)`を追加して storybook を起動すると、すでに rules に`/\.css$/`がいました。  
ということで、この rule を適用する際、xxx.module.css は除外してやれば良さそうです。  
main.js に以下を追加します。

```
module.exports = {
...
  webpackFinal: async config => {
    ...
    // ここから
    config.module.rules[7].exclude = [/\.module\.css$/]
    // ここまで

    // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
    config.resolve.mainFields = ["browser", "module", "main"]
    ...
  },
}
```

`rules[7]`とハードコーディングしているので、storybook のバージョンが変わったりしたら動かなくなりそうです。  
その時はまた rules の中身をみて直すかな・・・

とりあえず、これで、無事 storybook で xxx.module.css の内容が反映されました！

今回の変更点：[css modules を storybook に適用 · fuyu8/fuyu8\-log@889b113](https://github.com/fuyu8/fuyu8-log/commit/889b1132317cd87d7afd01a3fdd2fa001fa224ad)
