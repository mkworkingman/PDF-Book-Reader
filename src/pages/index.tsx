import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" meta={[
      {
        name: `TEST`,
        content: 'titleTest',
      },
      {
        name: `TEST2`,
        content: 'titleTest222',
      }
    ]}/>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
  </Layout>
)

export default IndexPage
