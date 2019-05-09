import React from "react"

interface NoteProps {
  className?: string;
  ghostNote: boolean;
  y: number;
}

const ThirtysecondNote = (NoteProps) => {
  const renderSymbol = () => {
    const normal = <>
      <path className="sW" d="m6.9 21v-21.0"></path>
      <text x="6.7" y="0"></text>
      <text x="0" y="21.5"></text>
    </>

    const cymbal = <>
      <path className="sW" d="m7 18.0v-18.0"></path> {/* stem */}
      <text x="6.7" y="0"></text>
      <path className="stroke" d="m1, 18 l6, 6 m0, -6 l-6,6"></path> {/* symbol */}
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
        className={`notes ${NoteProps.className}`}
        strokeWidth=".7"
        height="46px"
        width="16px"
        style={{
          top: `${NoteProps.y - 35}px`
        }}
      >
        {renderSymbol()}
        {
          NoteProps.ghostNote &&
          <>
            <text x="-3" y="41" className="dacs" textAnchor="middle">(</text>
            <text x="17" y="41" className="dacs" textAnchor="middle">)</text>
          </>
        }
        {NoteProps.includeLedger && <text x="0" y="21"></text>}
      </svg>
  )
}
  

export { ThirtysecondNote }