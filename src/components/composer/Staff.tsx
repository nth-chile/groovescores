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

type TContent = Array<IBarObj>

// Initial content of staff
let INITIAL_CONTENT: TContent = [
  {
    barStart: CLEF_AND_TIME_SIG_WIDTH + BAR_X_PADDING,
    barWidth: undefined,
    notes: ["[z]2", "[z]2"],
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
  const [mouseOffset, setMouseOffset] = useState(null)
  const [unplacedNotePosition, setUnplacedNotePosition] = useState(null)
 
  const staffLineWidthBeforeScale = SVG_WIDTH < StaffProps.maxWidth - (SVG_WIDTH_TIMES_SCALE - SVG_WIDTH) ? SVG_WIDTH - 1.5 : SVG_WIDTH * StaffProps.maxWidth / SVG_WIDTH_TIMES_SCALE - 1.5
  const staffLineWidthAfterScale = staffLineWidthBeforeScale * SVG_SCALE

  const firstBarLinePosBeforeScale = 205.8 / 398.5 * staffLineWidthBeforeScale
  const firstBarLinePosAfterScale = firstBarLinePosBeforeScale * SVG_SCALE

  const svgRef = useRef(null)

  const mousemoveHandler = useCallback(throttle((e) => {
    setMouseOffset([e.offsetX, e.offsetY])
  }, 25, {leading: true, trailing: false}), [])

  INITIAL_CONTENT[1].barStart = firstBarLinePosAfterScale + BAR_X_PADDING
  INITIAL_CONTENT[0].barWidth = firstBarLinePosAfterScale - INITIAL_CONTENT[0].barStart - BAR_X_PADDING
  INITIAL_CONTENT[1].barWidth = staffLineWidthAfterScale - firstBarLinePosAfterScale - (BAR_X_PADDING * 2)
  const [content, setContent] = useState<TContent>(INITIAL_CONTENT)

  // Update content when content[x].notes changes
  useEffect(() => {
    // Shallow clone state
    let newContent = [...content];

    for (let i = 0; i < content.length; i++) {
      let notePos = content[i].barStart
      let newNoteStartPositions = [];

      // Get and push note start positions to newNoteStartPositions
      for(let j = 0; j < content[i].notes.length; j++) {
        const note = content[i].notes[j]
        const currentNoteWidth = utils.getNoteWidthInPx(note, content[i].barWidth)
        let currentNoteStartPos = notePos
        notePos += currentNoteWidth

        // Exception: if only one note, center it
        if (content[i].notes.length === 1) {
          currentNoteStartPos = content[i].barStart + (content[i].barWidth / 2) - 5
        }

        newNoteStartPositions.push(currentNoteStartPos)
      }

      // Update newContent
      newContent[i] = {
        ...newContent[i],
        noteStartPositions: newNoteStartPositions
      }
    }
    
    // Set content
    setContent(newContent)
  }, [content[0].notes, content[1].notes ])

  // Assign event listeners
  useEffect(() => {
    if (svgRef !== null) {
      svgRef.current.onclick = (e) => {
        intendedNoteDataByMouseX(e.offsetX)
      }
      svgRef.current.onmousemove = mousemoveHandler

      return () => {
        svgRef.current.onclick = null;
        svgRef.current.onmousemove = null;
      }
    }
  })

  useEffect(() => {
    if (mouseOffset !== null) {
      const intendedNote = utils.intendedNoteByMouseY(mouseOffset[1] * SVG_SCALE)
      const noteYPos = intendedNote && utils.noteTopPosByAbcNote[intendedNote]
      const noteData = intendedNoteDataByMouseX(mouseOffset[0])
      const noteXPos = content[noteData.barIndex].noteStartPositions[noteData.noteIndex]

      setUnplacedNotePosition([noteXPos, noteYPos])
    }
  }, [mouseOffset])

  const intendedNoteDataByMouseX = (x: number) : { barIndex: number , noteIndex: number, noteWidth: number }  => {
    x *= SVG_SCALE
    
    const barIndex = x < firstBarLinePosAfterScale ? 0 : 1
    const notes = content[barIndex].notes
    let accumulatedContentWidth: number = 0
    let noteStartPos: number;
    let noteIndex: number;
    let noteWidth: number;

    for(let i = 0; i < content[barIndex].noteStartPositions.length; i++) {
      const startPos = content[barIndex].noteStartPositions[i]
      const prevStartPos = content[barIndex].noteStartPositions[i - 1]

      if (x < startPos) {
        if (i === 0) {
          noteStartPos = startPos
          noteIndex = i
          noteWidth = utils.getNoteWidthInPx(notes[noteIndex], content[barIndex].barWidth)
          break
        }

        noteStartPos = prevStartPos
        noteIndex = i - 1
        noteWidth = utils.getNoteWidthInPx(notes[noteIndex], content[barIndex].barWidth)
        break
      }

      // If the script exits here, this must be the last note
      noteStartPos = startPos
      noteIndex = i
      noteWidth = utils.getNoteWidthInPx(notes[noteIndex], content[barIndex].barWidth)
    }

    return { barIndex, noteIndex, noteWidth }
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
      {unplacedNotePosition && unplacedNotePosition[1] &&
        <Note
          colorState="unplaced"
          ghostNote={StaffProps.toolbarState.noteType === "ghost note"}
          SVG={NoteSVGs[utils.optionsToSVGNoteCtName(StaffProps.toolbarState)]}
          scale={SVG_SCALE}
          x={unplacedNotePosition[0]}
          y={unplacedNotePosition[1]}
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