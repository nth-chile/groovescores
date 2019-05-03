import React, { useCallback, useEffect, useState, useRef } from "react"
import styled from "styled-components"
import throttle from "lodash/throttle"
import { Note } from "."
import * as NoteSVGs from "./noteSVGs"

const SVG_HEIGHT = 67.5
const SVG_WIDTH = 400
const SVG_SCALE = 1.975
const SVG_WIDTH_TIMES_SCALE = SVG_WIDTH * SVG_SCALE
const SVG_HEIGHT_TIMES_SCALE = SVG_HEIGHT * SVG_SCALE
const BAR_X_PADDING = 10 // Note section borders will stay this far from the edge of a bar
const CLEF_AND_TIME_SIG_WIDTH = 70 // Offset for the beginning edge of first note section

// Returns abc notation for the note that belongs at the given Y axis
const getNoteByYAxis = (y: number) : string | false => {
  switch(true) {
    case (33.5 < y && y <= 40.5): return "^A'"
    case (40.5 < y && y <= 45.5): return "^g"
    case (45.5 < y && y <= 51.5): return "f" // good
    case (51.5 < y && y <= 57.5): return "e"
    case (57.5 < y && y <= 63.5): return "d" // good
    case (63.5 < y && y <= 68.5): return "c"
    case (68.5 < y && y <= 75.5): return "B" // good
    case (75.5 < y && y <= 79.5): return "A"
    case (79.5 < y && y <= 86.5): return "G" // good
    case (86.5 < y && y <= 92.5): return "F"
    case (92.5 < y && y <= 97.5): return "E" // good
    case (97.5 < y && y <= 106.5): return "^D"
    default: return false
  }
}

// Returns abc notation for the note that belongs at the given Y axis
const getNotePosFromAnyYOffsetValue = (y: number) : number | false => {
  switch(true) {
    case (33.5 < y && y <= 40.5): return 33.5
    case (40.5 < y && y <= 45.5): return 40.5
    case (45.5 < y && y <= 51.5): return 45.5
    case (51.5 < y && y <= 57.5): return 51.5
    case (57.5 < y && y <= 63.5): return 57.5
    case (63.5 < y && y <= 68.5): return 63.5
    case (68.5 < y && y <= 75.5): return 68.5
    case (75.5 < y && y <= 79.5): return 75.5
    case (79.5 < y && y <= 86.5): return 79.5
    case (86.5 < y && y <= 92.5): return 86.5
    case (92.5 < y && y <= 97.5): return 92.5
    case (97.5 < y && y <= 106.5): return 97.5
    default: return false
  }
}

// Initial content of staff
const INITIAL_CONTENT = [
  {
    sections: ["[z]2", "[z]2"]
  },
  {
    sections: ["[z]4"]
  }
]

const getSectionLengthAsFraction = (sections: Array<string>, sectionIndex: number) : string => {
  const regex = /(?!])(\d+)(?:\/)*(\d+)*/
  const matchArray = sections[sectionIndex].match(regex)
  return `${matchArray[1]}/${matchArray[2] || 1}`
}

interface StaffProps {
  className?: string;
  maxWidth: number;
}

const UnstyledStaff = (StaffProps) => {
  const [content, setContent] = useState(INITIAL_CONTENT)
  const [yMouseOffset, setYMouseOffset] = useState(null)
  const [hoveredNotePosition, setHoveredNotePosition] = useState(null)
  const staffLineWidthBeforeScale =
    SVG_WIDTH < StaffProps.maxWidth - (SVG_WIDTH_TIMES_SCALE - SVG_WIDTH) ?
    SVG_WIDTH - 1.5 :
    SVG_WIDTH * StaffProps.maxWidth / SVG_WIDTH_TIMES_SCALE - 1.5
  const firstBarLinePosBeforeScale = 205.8 / 398.5 * staffLineWidthBeforeScale
  const svgRef = useRef(null)
  const mousemoveHandler = useCallback(throttle((e) => {
    setYMouseOffset(e.offsetY)
  }, 25, {leading: true, trailing: false}), [])
  
  // Assign evt listener for clicks on staff
  useEffect(() => {
    if (svgRef !== null) {
      svgRef.current.onclick = (e) => {
        logSection(e.offsetX, e.offsetY)
      }

      return () => svgRef.current.onclick = null;
    }
  })

  // Assign evt listener for mousemove on staff
  useEffect(() => {
    if (svgRef !== null) {
      svgRef.current.onmousemove = mousemoveHandler

      return () => svgRef.current.onmousemove = null;
    }
  })

  useEffect(() => {
    setHoveredNotePosition(getNotePosFromAnyYOffsetValue(yMouseOffset * SVG_SCALE))
    console.log(getNoteByYAxis(yMouseOffset * SVG_SCALE))
  }, [yMouseOffset])

  const logSection = (x, y) => {
    x *= SVG_SCALE
    y *= SVG_SCALE

    const firstBarLinePos = 205.8 / 398.5 * staffLineWidthBeforeScale * SVG_SCALE;

    const barIndex = x < firstBarLinePos ? 0 : 1;
    const barSections = content[barIndex].sections;
    let writeableBarStartPos: number
    let writableBarWidth: number
    let accumulatedSectionWidth: number = 0
  
    // Determine writeableBarStartPos and writableBarWidth
    if (barIndex === 0) {
      writeableBarStartPos = CLEF_AND_TIME_SIG_WIDTH + BAR_X_PADDING
      writableBarWidth = firstBarLinePos - writeableBarStartPos - BAR_X_PADDING
    } else {
      writeableBarStartPos = firstBarLinePos + BAR_X_PADDING
      writableBarWidth = (staffLineWidthBeforeScale * SVG_SCALE) - firstBarLinePos - (BAR_X_PADDING * 2)
    }

    for (let i = 0; i < barSections.length; i++) {              // Iterate through sections
      let fraction = getSectionLengthAsFraction(barSections, i) // extract fraction
      let split = fraction.split("/")
      let float = parseFloat(split[0]) / parseFloat(split[1])
      let percentage = float / 4 * 100                          // convert to percentage
      let writeableCurrentSectionWidth = percentage * writableBarWidth / 100     // convert that to pixels
      let writeableSectionStartPos = writeableBarStartPos + accumulatedSectionWidth
      let writeableSectionEndPos = writeableBarStartPos + accumulatedSectionWidth + writeableCurrentSectionWidth

      if (writeableSectionStartPos < x && x < writeableSectionEndPos + BAR_X_PADDING) { // compare to x
        console.log(`
          Bar Index: ${barIndex}
          Section Index: ${i}
          Y: ${y}
          Note: ${getNoteByYAxis(y)}
          Section Length: ${fraction}
          Selector x position from SVG left: ${x}
          Writeable section Start position: ${writeableSectionStartPos}
          Writeable section End Position: ${writeableSectionEndPos}
          Writeable section Width: ${writeableCurrentSectionWidth}
        `)
  
        break;
      }

      // if no match, add to `accumulatedSectionWidth`
      accumulatedSectionWidth += writeableCurrentSectionWidth
    }
  }

  return (
    <div className={`music ${StaffProps.className}`}>
      <Note
        colorState="unplaced"
        SVG={NoteSVGs.QuarterNote}
        scale={SVG_SCALE}
        x={0}
        y={0}
      />
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
    <div className="unplaced-note" style={{
      height: "11px",
      left: "150px",
      width: "11px",
      background: "blue",
      borderRadius: "8px",
      position: "absolute"
    }}></div>
    </div>
  )
}

const Staff = styled(UnstyledStaff)<StaffProps>`
  position: relative;

  svg.music {
    transform: scale(${SVG_SCALE});
  }
  
  .unplaced-note {
    top: ${props => props.hoveredNotePosition + 41}px;
  }
`

export { Staff }