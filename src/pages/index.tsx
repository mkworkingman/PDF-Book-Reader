import React, { useState, useEffect, useRef } from "react"
import * as pdfjsLib from 'pdfjs-dist'

import Layout from "../components/layout"
import SEO from "../components/seo"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js`

const IndexPage = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null)
  const [bookSelected, setBookSelected] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  
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
          setLoading(false)
        })
      })
    }
  }

  useEffect(() => {
    setBookSelected(localStorage.getItem('current') || '')
    setLoading(localStorage.getItem('current') ? true : false)
  }, []);

  useEffect(() => {
    setCtx(canvas.current.getContext('2d'))
  }, [canvas])

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum)
    }
  }, [pdfDoc])

  useEffect(() => {
    if (bookSelected) {
      if (localStorage.getItem(bookSelected)) {
        setPageNum(Number(localStorage.getItem(bookSelected)))
        setGoTo(localStorage.getItem(bookSelected))
      } else {
        localStorage.setItem(bookSelected, '1')
        setPageNum(1)
      }

      const PDFFile = require(`../books/${bookSelected}.pdf`)
      pdfjsLib.getDocument(PDFFile).promise.then((PDFDocumentProxy: any) => {
        setPdfDoc(PDFDocumentProxy)
      })
    }
  }, [bookSelected])

  const changePage = (newPageNum: number) => {
    if (!pageRendering) {
      if (newPageNum > 0 && newPageNum <= pdfDoc.numPages) {
        setGoTo(newPageNum.toString())
        setPageNum(newPageNum)
        renderPage(newPageNum)
        localStorage.setItem(bookSelected, newPageNum.toString())
      } else {
        if (newPageNum) {
          setGoTo(pdfDoc.numPages.toString())
          setPageNum(pdfDoc.numPages)
          renderPage(pdfDoc.numPages)
          localStorage.setItem(bookSelected, pdfDoc.numPages.toString())
        } else {
          setGoTo('1')
          setPageNum(1)
          renderPage(1)
          localStorage.setItem(bookSelected, '1')
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
    setLoading(true)
    setBookSelected(value)
  }

  const Spinner = (): JSX.Element => (
    <svg className={"spinner animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500 " + (!bookSelected && 'hidden')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )

  if (typeof document !== 'undefined') {
    document.onkeydown = arrowAction;
  }

  return (
    <Layout>
      <SEO title="Home" />

      <div className="flex flex-col items-center">
        <p>Please, select a book:</p>
        <select
          className="focus:outline-none self-center w-60 text-center"
          style={{textAlignLast: 'center'}}
          onChange={e => setBook(e.target.value)}
          onKeyDown={e => e.preventDefault()}
          value={bookSelected}
        >
          <option value="" disabled>Select a book</option>
          <option value="1984">1984</option>
          <option value="crime-and-punishment">Crime And Punishment</option>
          <option value="dracula">Dracula</option>
          <option value="the-great-gatsby">The Great Gatsby</option>
          <option value="war-and-peace">War And Peace</option>
        </select>

        {bookSelected &&
          <div 
            className="flex items-center mb-2 justify-between"
            style={{width: 450}}
          >
            <button
              onClick={() => changePage(pageNum - 1)}
              className="changePage focus:outline-none"
            >
              <span className="relative z-10">Prev Page</span>
            </button>
            {!loading &&
              <p className="font-medium w-60 text-center">{pageNum} page of {pdfDoc && pdfDoc.numPages}</p>
            }
            <button
              onClick={() => changePage(pageNum + 1)}
              className="changePage focus:outline-none"
            >
              <span className="relative z-10">Next Page</span>
            </button>
          </div>
        }

        <canvas ref={canvas} className={loading ? 'hidden' : ''}/>

        {(pdfDoc && !loading)
          ? <div className={(pdfDoc && !loading) ? '' : 'hidden'}>
          <p className="text-center font-medium">Go to:</p>
          <input
            value={goTo}
            onKeyDown={onKeyDown}
            onChange={changeGoTo}
            className="rounded-lg focus:outline-none border-2 border-solid border-indigo-400 w-40 px-2 py-1 focus:border-indigo-500 text-center font-medium"
          />
        </div>
          : <Spinner />
        }
      </div>
    </Layout>
  )
}

export default IndexPage
