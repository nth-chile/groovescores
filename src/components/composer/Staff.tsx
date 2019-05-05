import React, { useCallback, useEffect, useState, useRef } from "react"
import styled from "styled-components"
import throttle from "lodash/throttle"
import { AbcToSVGNote, Note } from "."
import * as NoteSVGs from "./noteSVGs"
import * as utils from "../../utils"

const SVG_HEIGHT = 67.5
const SVG_WIDTH = 400
const SVG_SCALE = 1.975
const SVG_WIDTH_TIMES_SCALE = SVG_WIDTH * SVG_SCALE
const SVG_HEIGHT_TIMES_SCALE = SVG_HEIGHT * SVG_SCALE
const BAR_X_PADDING = 19 // Note section borders will stay this far from the edge of a bar
const CLEF_AND_TIME_SIG_WIDTH = 70 // Offset for the beginning edge of first note section


interface IBarObj {
  barStart: number;
  barWidth: number;
  notes: Array<string>;
  noteStartPositions: Array<number>;
}

type TContent = [IBarObj, IBarObj]

// Initial content of staff
let INITIAL_CONTENT: TContent = [
  {
    barStart: CLEF_AND_TIME_SIG_WIDTH + BAR_X_PADDING,
    barWidth: undefined,
    notes: ["[z]4"],
    noteStartPositions: [],
  },
  {
    barStart: undefined,
    barWidth: undefined,
    notes: ["[f]4"],
    noteStartPositions: [],
  }
]

interface StaffProps {
  className?: string;
  maxWidth: number;
  toolbarState: object;
}

const UnstyledStaff = (StaffProps) => {
  const [yMouseOffset, setYMouseOffset] = useState(null)
  const [unplacedNotePosition, setUnplacedNotePosition] = useState(null)
 
  const staffLineWidthBeforeScale = SVG_WIDTH < StaffProps.maxWidth - (SVG_WIDTH_TIMES_SCALE - SVG_WIDTH) ? SVG_WIDTH - 1.5 : SVG_WIDTH * StaffProps.maxWidth / SVG_WIDTH_TIMES_SCALE - 1.5
  const staffLineWidthAfterScale = staffLineWidthBeforeScale * SVG_SCALE

  const firstBarLinePosBeforeScale = 205.8 / 398.5 * staffLineWidthBeforeScale
  const firstBarLinePosAfterScale = firstBarLinePosBeforeScale * SVG_SCALE

  const svgRef = useRef(null)

  const mousemoveHandler = useCallback(throttle((e) => {
    setYMouseOffset(e.offsetY)
  }, 25, {leading: true, trailing: false}), [])

  INITIAL_CONTENT[1].barStart = firstBarLinePosAfterScale + BAR_X_PADDING
  INITIAL_CONTENT[0].barWidth = firstBarLinePosAfterScale - INITIAL_CONTENT[0].barStart - BAR_X_PADDING
  INITIAL_CONTENT[1].barWidth = staffLineWidthAfterScale - firstBarLinePosAfterScale - (BAR_X_PADDING * 2)
  const [content, setContent] = useState<TContent>(INITIAL_CONTENT)

  // Assign event listeners
  useEffect(() => {
    if (svgRef !== null) {
      svgRef.current.onclick = (e) => {
        logSection(e.offsetX, e.offsetY)
      }
      svgRef.current.onmousemove = mousemoveHandler

      return () => {
        svgRef.current.onclick = null;
        svgRef.current.onmousemove = null;
      }
    }
  })

  useEffect(() => {
    const intendedNote = utils.intendedNoteByMouseY(yMouseOffset * SVG_SCALE)
    const noteTopPos = intendedNote && utils.noteTopPosByAbcNote[intendedNote]

    setUnplacedNotePosition(noteTopPos)
  }, [yMouseOffset])

  const logSection = (x, y) => {
    x *= SVG_SCALE
    y *= SVG_SCALE
    
    const barIndex = x < firstBarLinePosAfterScale ? 0 : 1
    const notes = content[barIndex].notes
    let accumulatedContentWidth: number = 0

    for (let i = 0; i < notes.length; i++) {
      let currentNoteWidth = utils.getNoteWidthInPx(notes[i], content[barIndex].barWidth)
      let currentNoteStartPos = content[barIndex].barStart + accumulatedContentWidth

      if (currentNoteStartPos < x && x < currentNoteStartPos + currentNoteWidth + BAR_X_PADDING) { // compare to x
        console.log(`
          Bar index: ${barIndex}
          Note position: ${currentNoteStartPos}
          Note width: ${currentNoteWidth}
        `)
        break;
      }

      // if no match, add to `accumulatedContentWidth`
      accumulatedContentWidth += currentNoteWidth
    }
  }

  const outputBar = (barIndex) => {
    let notePos = content[barIndex].barStart

    return content[barIndex].notes.map((note, i) => {
      const currentNoteWidth = utils.getNoteWidthInPx(note, content[barIndex].barWidth)
      let currentNoteStartPos = notePos
      notePos += currentNoteWidth

      // Exception: if only one note, center it
      if (content[barIndex].notes.length === 1) {
        currentNoteStartPos = content[barIndex].barStart + (content[barIndex].barWidth / 2) - 5
      }

      return <AbcToSVGNote  abc={note} key={i} SVGScale={SVG_SCALE} x={currentNoteStartPos} />
    })
  }

  return (
    <div className={`music ${StaffProps.className}`}>
      {unplacedNotePosition && false && 
        <Note
          colorState="unplaced"
          ghostNote={StaffProps.toolbarState.noteType === "ghost note"}
          SVG={NoteSVGs[utils.optionsToSVGNoteCtName(StaffProps.toolbarState)]}
          scale={SVG_SCALE}
          x={170}
          y={unplacedNotePosition}
        />
      }

      {/* Place the notes */}
      {outputBar(0)}
      {outputBar(1)}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        color="black"
        className="music"
        strokeWidth=".7"
        width={`${SVG_WIDTH}px`}
        height={`${SVG_HEIGHT_TIMES_SCALE}px`}
        ref={svgRef}
      >
        <path
          className="slW"
          d={`M0,26 h${staffLineWidthBeforeScale}
            m-${staffLineWidthBeforeScale} 6 h${staffLineWidthBeforeScale}
            m-${staffLineWidthBeforeScale},6 h${staffLineWidthBeforeScale}
            m-${staffLineWidthBeforeScale},6 h${staffLineWidthBeforeScale}
            m-${staffLineWidthBeforeScale},6 h${staffLineWidthBeforeScale}`}
        >
        </path>
        <path className="bW" d={`M${staffLineWidthBeforeScale},50.0 v-24.0`}></path>
        <path className="bW" d={`M${firstBarLinePosBeforeScale},50.0 v-24.0`}></path>
        <text x="6.5" y="38.0"></text>
        <g transform="translate(30.5,44.0)" textAnchor="middle">
        <text y="-12"></text>
        <text></text>
        </g>
      </svg>
    </div>
  )
}

const Staff = styled(UnstyledStaff)<StaffProps>`
  position: relative;

  svg.music {
    transform: scale(${SVG_SCALE});
  }
`

export { Staff }