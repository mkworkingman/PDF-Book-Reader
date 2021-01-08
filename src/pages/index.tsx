import React, { useState, useEffect, useRef } from "react"
import * as pdfjsLib from 'pdfjs-dist'

import Layout from "../components/layout"
import SEO from "../components/seo"
import PDFFile from '../books/war-and-peace.pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js`

const IndexPage = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null)
  
  const scale: number = 1.35
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [pageNum, setPageNum] = useState<number>(1)
  const [pageRendering, setPageRendering] = useState<boolean>(false)

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
      })
    }
  }, [ctx])

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum)
    }
  }, [pdfDoc])

  const changePage = (increment: boolean) => {
    const newPageNum = increment
      ? pageNum + 1
      : pageNum - 1
    
    if (newPageNum > 0 && newPageNum <= pdfDoc.numPages) {
      setPageNum(newPageNum)
      renderPage(newPageNum)
    }
  }

  return (
    <Layout>
      <SEO title="Home" />
      <div className="flex items-center justify-evenly mb-2">
        <button
          onClick={() => changePage(false)}
          className="changePage focus:outline-none"
          disabled={pageNum === 1}
        >
          <span className="relative z-10">Prev Page</span>
        </button>
        <p className="font-medium">{pageNum} page of {pdfDoc && pdfDoc.numPages}</p>
        <button
          onClick={() => changePage(true)}
          className="changePage focus:outline-none"
          disabled={pdfDoc && pageNum === pdfDoc.numPages}
        >
          <span className="relative z-10">Next Page</span>
        </button>
      </div>
      <canvas ref={canvas} className={"mx-auto "} />
    </Layout>
  )
}

export default IndexPage
