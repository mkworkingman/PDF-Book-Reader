import React from "react"
import * as pdfjsLib from 'pdfjs-dist'

import Layout from "../components/layout"
import SEO from "../components/seo"
import PDFFile from './1984.pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js`

pdfjsLib.getDocument(PDFFile).promise.then(pdfDoc => {
  console.log(pdfDoc)
})

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <canvas id="PDF-reader" />
    <button onClick={() => console.log(pdfjsLib)}>test</button>
  </Layout>
)

export default IndexPage
