import { graphql, Link, PageProps } from "gatsby"
import React from "react"
import { TagPageContext } from "../../gatsby-node"
import { BlogPostByTagQuery } from "../../types/graphql-types"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Posts from "../components/posts"

type DataProps = BlogPostByTagQuery
type PageContextProps = TagPageContext

const Tags: React.FC<PageProps<DataProps, PageContextProps>> = ({
  data,
  pageContext,
  location,
}) => {
  const { tag } = pageContext
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const { edges } = data.allMarkdownRemark

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={"tag: " + tag} />
      <Bio />
      <h3>{"tag: " + tag}</h3>
      <Posts posts={edges}></Posts>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query BlogPostByTag($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
