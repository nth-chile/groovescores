import React, { useCallback, useEffect, useState, useRef } from "react"
import styled from "styled-components"
import throttle from "lodash/throttle"
import { Note } from "."
import * as NoteSVGs from "./noteSVGs"
import * as utils from "../../utils"

const SVG_HEIGHT = 67.5
const SVG_WIDTH = 400
const SVG_SCALE = 1.975
const SVG_WIDTH_TIMES_SCALE = SVG_WIDTH * SVG_SCALE
const SVG_HEIGHT_TIMES_SCALE = SVG_HEIGHT * SVG_SCALE
const BAR_X_PADDING = 10 // Note section borders will stay this far from the edge of a bar
const CLEF_AND_TIME_SIG_WIDTH = 70 // Offset for the beginning edge of first note section

// Initial content of staff
const INITIAL_CONTENT = [
  {
    sections: ["[z]2", "[z]2"]
  },
  {
    sections: ["[z]4"]
  }
]

interface StaffProps {
  className?: string;
  maxWidth: number;
}

const UnstyledStaff = (StaffProps) => {
  const [content, setContent] = useState(INITIAL_CONTENT)
  const [yMouseOffset, setYMouseOffset] = useState(null)
  const [unplacedNotePosition, setUnplacedNotePosition] = useState(null)

  const staffLineWidthBeforeScale = SVG_WIDTH < StaffProps.maxWidth - (SVG_WIDTH_TIMES_SCALE - SVG_WIDTH) ? SVG_WIDTH - 1.5 : SVG_WIDTH * StaffProps.maxWidth / SVG_WIDTH_TIMES_SCALE - 1.5
  const firstBarLinePosBeforeScale = 205.8 / 398.5 * staffLineWidthBeforeScale
  const svgRef = useRef(null)
  const mousemoveHandler = useCallback(throttle((e) => {
    setYMouseOffset(e.offsetY)
  }, 25, {leading: true, trailing: false}), [])
  
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

    const firstBarLinePos = 205.8 / 398.5 * staffLineWidthBeforeScale * SVG_SCALE

    const barIndex = x < firstBarLinePos ? 0 : 1
    const barSections = content[barIndex].sections
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
      let fraction = utils.getSectionLengthAsFraction(barSections, i) // extract fraction
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
          Note: ${utils.intendedNoteByMouseY(y)}
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
      {unplacedNotePosition &&
        <Note
          colorState="unplaced"
          SVG={NoteSVGs.SixteenthNote}
          scale={SVG_SCALE}
          x={170}
          y={unplacedNotePosition}
        />
      }

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