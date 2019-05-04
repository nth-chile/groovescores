import React from "react"

const WholeNote = (props: { className: string, y: number }) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    // xmlns:xlink="http://www.w3.org/1999/xlink"
    // color="black"
    className={`notes ${props.className}`}
    strokeWidth=".7"
    height="8px"
    width="12px"
    style={{
      top: `${props.y - 1}px`
    }}
  >
    <text x="1" y="4"></text>
  </svg>

export { WholeNote }