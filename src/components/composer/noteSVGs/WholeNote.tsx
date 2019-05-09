import React from "react"

interface NoteProps {
  className?: string;
  ghostNote: boolean;
  includeLedger: boolean;
  symbolModifier?: string;
  y: number;
}

const WholeNote = (NoteProps) => {
  const renderSymbol = () => {
    const normal = <>
      <text x="1" y="4"></text>
    </>

    const cymbal = <>
      <path className="stroke" d="m3, .8 l6, 6 m0, -6 l-6,6"></path> {/* symbol */}
    </>

    switch (NoteProps.symbolModifier) {
      case "cymbal": return cymbal
      default: return normal
    }
  }

  return (
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
      {renderSymbol()}
      {
        NoteProps.ghostNote &&
        <>
          <text x="-1" y="13" className="dacs" textAnchor="middle">(</text>
          <text x="22" y="13" className="dacs" textAnchor="middle">)</text>
        </>
      }
      {NoteProps.includeLedger && <text x="2" y="3.5"></text>}
    </svg>
  )
}

export { WholeNote }