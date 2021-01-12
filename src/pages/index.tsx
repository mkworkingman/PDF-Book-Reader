import React, { useState, useEffect, useRef } from "react"
import * as pdfjsLib from 'pdfjs-dist'

import Layout from "../components/layout"
import SEO from "../components/seo"
// import PDFFile from '../books/war-and-peace.pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js`

const IndexPage = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null)
  const [bookSelected, setBookSelected] = useState<string>(localStorage.getItem('current') || '')
  
  const scale: number = 1.2
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [pageNum, setPageNum] = useState<number>(1)
  const [goTo, setGoTo] = useState<string>('1')
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
    if (bookSelected) {
      const PDFFile = require(`../books/${bookSelected}.pdf`)
      pdfjsLib.getDocument(PDFFile).promise.then((PDFDocumentProxy: any) => {
        setPdfDoc(PDFDocumentProxy)
      })
    }
  }, [bookSelected])

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum)
    }
  }, [pdfDoc])

  const changePage = (newPageNum: number) => {
    if (!pageRendering) {
      if (newPageNum > 0 && newPageNum <= pdfDoc.numPages) {
        setGoTo(newPageNum.toString())
        setPageNum(newPageNum)
        renderPage(newPageNum)
      } else {
        if (newPageNum) {
          setGoTo(pdfDoc.numPages.toString())
          setPageNum(pdfDoc.numPages)
          renderPage(pdfDoc.numPages)
        } else {
          setGoTo('1')
          setPageNum(1)
          renderPage(1)
        }
      }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      changePage(Number(goTo))
    }
  }

  const changeGoTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    if (/^(\s*|\d+)$/.test(value)) {
      setGoTo(value)
    } else {
      e.preventDefault()
    }
  }

  const arrowAction = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') {
      changePage(pageNum - 1)
    } else if (e.code === 'ArrowRight') {
      changePage(pageNum + 1)
    }
  }

  const setBook = (value: string) => {
    localStorage.setItem("current", value)
    setBookSelected(value)
  }

  const Spinner = ({display = ''}): JSX.Element => (
    <svg className={"spinner animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500 " + display} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )

  document.onkeydown = arrowAction;

  return (
    <Layout>
      <SEO title="Home" />
      <div className="flex flex-col justify-center text-center">
        <p>Please, select a book:</p>
        <select
          className="focus:outline-none self-center w-60 text-center"
          style={{textAlignLast: 'center'}}
          onChange={e => setBook(e.target.value)}
          value={bookSelected}
        >
          <option value="" disabled>Select a book</option>
          <option value="1984">1984</option>
          <option value="crime-and-punishment">Crime And Punishment</option>
          <option value="dracula">Dracula</option>
          <option value="the-great-gatsby">The Great Gatsby</option>
          <option value="war-and-peace">War And Peace</option>
        </select>
      </div>
      {pdfDoc
        ? <>
          <div className="flex items-center justify-evenly mb-2">
            <button
              onClick={() => changePage(pageNum - 1)}
              className="changePage focus:outline-none"
              disabled={pageNum === 1 || pageRendering}
            >
              <span className="relative z-10">Prev Page</span>
            </button>
            <p className="font-medium w-60 text-center">{pageNum} page of {pdfDoc && pdfDoc.numPages}</p>
            <button
              onClick={() => changePage(pageNum + 1)}
              className="changePage focus:outline-none"
              disabled={pageNum === pdfDoc.numPages || pageRendering}
            >
              <span className="relative z-10">Next Page</span>
            </button>
          </div>
        </>
        : <div className="flex justify-center">
          <Spinner />
        </div>
      }
      <div className="flex justify-center items-center">
        <div className={pageRendering ? 'hidden': 'flex flex-col items-center'}>
          <canvas ref={canvas} />
          <p className={"text-center font-medium" + (pdfDoc ? '' : ' hidden')}>Go to:</p>
          <input
            value={goTo}
            onKeyDown={onKeyDown}
            onChange={changeGoTo}
            className={"rounded-lg focus:outline-none border-2 border-solid border-indigo-400 w-40 px-2 py-1 focus:border-indigo-500 text-center font-medium" + (pdfDoc ? '' : ' hidden')}
          />
        </div>
        <Spinner display={pageRendering ? '' : 'hidden'} />
      </div>
    </Layout>
  )
}

export default IndexPage
