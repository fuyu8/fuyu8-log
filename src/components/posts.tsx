import { Link } from "gatsby"
import React from "react"
import { BlogPostByTagQuery, IndexQuery } from "../../types/graphql-types"

type Props = {
  posts:
    | IndexQuery["allMarkdownRemark"]["edges"]
    | BlogPostByTagQuery["allMarkdownRemark"]["edges"]
}

const Posts: React.FC<Props> = ({ posts }) => {
  if (posts.length === 0) {
    return <p>投稿がありません</p>
  }

  return (
    <ol style={{ listStyle: `none` }}>
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug

        return (
          <li key={node.fields.slug}>
            <article
              className="post-list-item"
              itemScope
              itemType="http://schema.org/Article"
            >
              <header>
                <h2>
                  <Link to={node.fields.slug} itemProp="url">
                    <span itemProp="headline">{title}</span>
                  </Link>
                </h2>
                <small>{node.frontmatter.date}</small>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                  itemProp="description"
                />
              </section>
            </article>
          </li>
        )
      })}
    </ol>
  )
}

export default Posts
