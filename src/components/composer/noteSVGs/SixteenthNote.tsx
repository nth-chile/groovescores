import React from "react"

interface NoteProps {
  className?: string;
  ghostNote: boolean;
  y: number;
}

const SixteenthNote = (NoteProps) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    className={`notes ${NoteProps.className}`}
    strokeWidth=".7"
    height="46px"
    width="16px"
    style={{
      top: `${NoteProps.y - 35}px`
    }}
  >
    <path className="sW" d="m7.3 21.0v-21.0"></path>
    <text x="7.3" y="0"></text>
    <text x="0" y="21"></text>
    {
      NoteProps.ghostNote &&
      <>
        <text x="-3" y="41" className="dacs" textAnchor="middle">(</text>
        <text x="17" y="41" className="dacs" textAnchor="middle">)</text>
      </>
    }
  </svg>

export { SixteenthNote }