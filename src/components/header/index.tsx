import React from "react"
import style from "./index.module.css"

const Header: React.FC = () => {
  console.log(style)
  return (
    <header>
      <h1 className={style.header}>header</h1>
    </header>
  )
}

export default Header
