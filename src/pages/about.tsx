import React from 'react'

import Layout from "../components/layout"
import SEO from "../components/seo"

const About = () => (
  <Layout>
    <SEO title="About" />
    <div>
      <p>Hello everyone!</p>
      <p>This is <span className="font-semibold">PDF Book Reader</span> - project created by Maxim Kalinin.</p>
      <p>The point of this app is to integrate PDF reading platform into Gatsby/React application and add some features like usung keyboard arrows to change current page and save your reading progress with localStorage.</p>
      <p className="font-semibold">Technologies used:</p>
      <p>PDF.js</p>
      <p>Gatsby, React.js</p>
      <p>SASS, Tailwind CSS</p>
    </div>
  </Layout>
)

export default About
