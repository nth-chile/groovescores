import React from "react"

const QuarterNote = (props: { className: string, y: number }) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    // xmlns:xlink="http://www.w3.org/1999/xlink"
    // color="black"
    className={`notes ${props.className}`}
    strokeWidth=".7"
    height="46px"
    width="8px"
    style={{
      top: `${props.y - 35}px`
    }}
  >
    <path className="sW" d="m7.2 21v-21.0"></path>
    <text y="21"></text>
  </svg>

export { QuarterNote }