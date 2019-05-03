import React from "react"

const QuarterNote = (props: { className: string }) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    // xmlns:xlink="http://www.w3.org/1999/xlink"
    // color="black"
    className={`notes ${props.className}`}
    strokeWidth=".7"
    height="46px"
    width="8px"
    // viewBox="0 0 8 46"
  >
    <path className="sW" d="m7.2 21v-21.0"></path>
    <text y="21"></text>
  </svg>

export { QuarterNote }