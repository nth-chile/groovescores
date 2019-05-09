import React from "react"

interface NoteProps {
  className?: string;
  ghostNote: boolean;
  y: number;
}

const QuarterNote = (NoteProps) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    className={`notes ${NoteProps.className}`}
    strokeWidth=".7"
    height="46px"
    width="8px"
    style={{
      top: `${NoteProps.y - 35}px`
    }}
  >
    <path className="sW" d="m7.2 21v-21.0"></path>
    <text y="21"></text>
    {
      NoteProps.ghostNote &&
      <>
        <text x="-3" y="41" className="dacs" textAnchor="middle">(</text>
        <text x="17" y="41" className="dacs" textAnchor="middle">)</text>
      </>
    }
  </svg>

export { QuarterNote }