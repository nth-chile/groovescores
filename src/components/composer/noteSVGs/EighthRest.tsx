import React from "react"

interface NoteProps {
  className?: string;
}

const EighthRest = (NoteProps) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    className={`notes ${NoteProps.className}`}
    strokeWidth=".7"
    height="4px"
    width="8px"
    style={{
      top: "75px"
    }}
  >
    <text x="0" y="0"></text>
  </svg>

export { EighthRest }

