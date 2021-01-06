import React, { ReactNode } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"

import "./layout.scss"

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <header className="w-full h-12 sm:h-16 bg-indigo-400 shadow-md fixed">
        <nav className="flex h-full px-4 mx-auto">
          <Link className="no-underline text-gray-800 font-medium flex items-center px-3.5 transition-colors duration-200 hover:bg-indigo-500" to="/">Home</Link>
          <Link className="no-underline text-gray-800 font-medium flex items-center px-3.5 transition-colors duration-200 hover:bg-indigo-500" to="/about">About</Link>
        </nav>
      </header>
      <main className="w-full mx-auto mt-12 sm:mt-16 mb-2 pt-2 px-8">
        {children}
      </main>
      <footer className="bg-indigo-400 text-center py-2 font-semibold mt-auto">
        © {new Date().getFullYear()} - Maxim Kalinin
      </footer>
    </>
  )
}

export default Layout
