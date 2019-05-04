import React from "react"

interface NoteProps {
  className?: string;
  ghostNote: boolean;
  y: number;
}

const WholeNote = (NoteProps) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    // xmlns:xlink="http://www.w3.org/1999/xlink"
    // color="black"
    className={`notes ${NoteProps.className}`}
    strokeWidth=".7"
    height="8px"
    width="12px"
    style={{
      top: `${NoteProps.y - 1}px`
    }}
  >
    <text x="1" y="4"></text>
    {
      NoteProps.ghostNote &&
      <>
        <text x="0" y="8" className="dacs" textAnchor="middle">(</text>
        <text x="13" y="8" className="dacs" textAnchor="middle">)</text>
      </>
    }
  </svg>

export { WholeNote }