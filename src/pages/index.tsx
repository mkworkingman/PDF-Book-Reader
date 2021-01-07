import React, { useState, useEffect, useRef } from "react"
import * as pdfjsLib from 'pdfjs-dist'

import Layout from "../components/layout"
import SEO from "../components/seo"
import PDFFile from '../books/1984.pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js`

const IndexPage = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null)
  
  const scale: number = 1.2
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [pageNum, setPageNum] = useState<number>(1)
  const [numPages, setNumPages] = useState<number>(null)
  const [pageRendering, setPageRendering] = useState<boolean>(false)
  const [pageNumPending , setPageNumPending ] = useState<number>(null)

  const renderPage = (num: any) => {
    if (canvas && canvas.current && ctx) {
      setPageRendering(true)
      pdfDoc.getPage(num).then((page: any) => {
        const viewport = page.getViewport({scale})
        canvas.current.height = viewport.height
        canvas.current.width = viewport.width

        const renderContext = {
          canvasContext: ctx,
          viewport
        }

        page.render(renderContext).promise.then(() => {
          setPageRendering(false)
    
          if (pageNumPending !== null) {
            renderPage(pageNumPending)
            setPageNumPending(null)
          }
        })
      })
    }
  }

  useEffect(() => {
    setCtx(canvas.current.getContext('2d'))
  }, [canvas])

  useEffect(() => {
    if (ctx) {
      pdfjsLib.getDocument(PDFFile).promise.then((PDFDocumentProxy: any) => {
        setPdfDoc(PDFDocumentProxy)
        setNumPages(PDFDocumentProxy.numPages)
      })
    }
  }, [ctx])

  useEffect(() => {
    // if (canvas && canvas.current && ctx && pdfDoc && numPages) {
    if (numPages) {
      renderPage(pageNum)
    }
  }, [numPages])

  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <p>{pageNum} page of {numPages}</p>
      <canvas ref={canvas} className="mx-auto" />
    </Layout>
  )
}

export default IndexPage
