"use strict"
require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "esnext",
  },
})
const {
  createPages,
  onCreateNode,
  createSchemaCustomization,
} = require("./gatsby-node/index")

exports.createPages = createPages
exports.onCreateNode = onCreateNode
exports.createSchemaCustomization = createSchemaCustomization
