import React from "react"

const ThirtysecondNote = (props: { className: string, y: number }) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    className={`notes ${props.className}`}
    strokeWidth=".7"
    height="46px"
    width="16px"
    style={{
      top: `${props.y - 35}px`
    }}
  >
    <path className="sW" d="m6.9 21v-21.0"></path>
    <text x="6.7" y="0"></text>
    <text x="0" y="21.5"></text>
  </svg>

export { ThirtysecondNote }