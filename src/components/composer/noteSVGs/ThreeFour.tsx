import React from "react"

interface Props {
  className?: string;
}

const ThreeFour = (Props) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    className={Props.className}
    strokeWidth=".7"
    width="10px"
    height="45px"
  >
    <g
      transform="translate(5,44)"
      textAnchor="middle"
    >
      <text y="-12"></text>
      <text></text>
    </g>
  </svg>

export { ThreeFour }

