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
        {pdfDoc
          ? <>
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
          </>
          : <svg className="spinner animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        }
      </div>
      <canvas ref={canvas} className={"mx-auto "} />
    </Layout>
  )
}

export default IndexPage
