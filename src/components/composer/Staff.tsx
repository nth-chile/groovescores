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
  }, [ content[0].notes.join(","), content[1].notes.join(",") ])

  // Define event listeners
  const mousemoveHandler = useCallback(throttle((e) => {
    setMouseOffset([e.offsetX, e.offsetY])
  }, 25, {leading: true, trailing: false}), [])

  const clickHandler = (e) => {
    const { barIndex, noteIndex: clickedNoteIndex } = intendedNoteDataByMouseX(e.offsetX)

    const clickedNoteLength = utils.getNoteLengthAsFloat(content[barIndex].notes[clickedNoteIndex])
    const unplacedNoteLength = utils.getNoteLengthAsFloat(StaffProps.toolbarState.noteLength)
    const newContent = [...content]
    // This starts at 1, so that a "next note" can be defined as being 1 index after clickedNoteIndex
    let nextNoteIndexOffset = 1

    // Clicked note is exactly as long as unplaced note. Remove clickedNote, add unplacedNote
    if (clickedNoteLength - unplacedNoteLength === 0) {
      const unplacedAbc = `[${utils.intendedNoteByMouseY(mouseOffset[1] * SVG_SCALE)}]${StaffProps.toolbarState.noteLength}`
      newContent[barIndex].notes.splice(clickedNoteIndex, 1, unplacedAbc)
      
      setContent(newContent)
      return
    } 
    
    // Clicked note is longer than unplaced note
    else if (clickedNoteLength > unplacedNoteLength ) {
      // Replace clickedNote with unplacedNote
      const unplacedAbc = `[${utils.intendedNoteByMouseY(mouseOffset[1] * SVG_SCALE)}]${StaffProps.toolbarState.noteLength}`
      newContent[barIndex].notes.splice(clickedNoteIndex, 1, unplacedAbc)

      // Fill remainder with rests, starting with rests the same length as unplacedNote
      let restFloatValueToPlace = clickedNoteLength - unplacedNoteLength

      while (restFloatValueToPlace > 0) {
        // Either restFloatValueToPlace is bigger, smaller, or the same as unplacedNoteLength
        
        // If it's the same, put in a rest of length === clickedNoteLength. Update restFloatValueToPlace.
        if (restFloatValueToPlace === unplacedNoteLength) {
          newContent[barIndex].notes.splice(clickedNoteIndex + 1, 0, "[z]" + StaffProps.toolbarState.noteLength)
          restFloatValueToPlace -= unplacedNoteLength
        }
        
        // If restFloatValueToPlace is smaller than unplacedNoteLength. TODO for dotted notes, triplets, and 3/4 meter
        else if (restFloatValueToPlace < unplacedNoteLength) {
          console.log('restFloatValueToPlace < unplacedNoteLength. Are you in 3/4 time, or using dotted notes or triplets?')
          // const rest = "[z]" + utils.floatToFraction(nextNoteLength)
          // newContent[barIndex].notes.splice(clickedNoteIndex + nextNoteIndexOffset, 1, rest)
          // restFloatValueToPlace -= nextNoteLength
          // nextNoteIndexOffset++
        }
        
        // If restFloatValueToPlace is bigger than unplacedNoteLength, add the rest, subtract unplacedNoteLength from restFloatValueToPlace and increment nextNoteIndexOffset
        else if (restFloatValueToPlace > unplacedNoteLength) {
          const rest = "[z]" + StaffProps.toolbarState.noteLength
          newContent[barIndex].notes.splice(clickedNoteIndex + nextNoteIndexOffset, 0, rest)
          nextNoteIndexOffset++
          restFloatValueToPlace -= unplacedNoteLength
        }
      }
    }
    
    // Clicked note is shorter than unplaced note
    else if (clickedNoteLength < unplacedNoteLength) {
      // First, remove the clicked note and decrement nextNoteIndexOffset
      newContent[barIndex].notes.splice(clickedNoteIndex, 1)
      nextNoteIndexOffset--

      // accumulatedRemovedNotesLength is the number that tells us if enough notes have been removed in order to add the unplacedNote
      let accumulatedRemovedNotesLength = clickedNoteLength

      while(accumulatedRemovedNotesLength < unplacedNoteLength) {
        // The next note either doesnt exist, is longer, shorter, or the same as unplacedNoteLength - clickedNoteLength

        // If the note doesnt exist, exit the loop
        if (newContent[barIndex].notes.length <= clickedNoteIndex + nextNoteIndexOffset) {
          break
        }

        const nextNoteLength: number = utils.getNoteLengthAsFloat(newContent[barIndex].notes[clickedNoteIndex + nextNoteIndexOffset]);

        // If the next note is the same, remove it and add its length to accumulatedRemovedNotesLength
        if (nextNoteLength === unplacedNoteLength - clickedNoteLength) {
          newContent[barIndex].notes.splice(clickedNoteIndex + nextNoteIndexOffset, 1)
          accumulatedRemovedNotesLength += nextNoteLength
        }

        // If the next note is shorter, remove it, add its length to accumulatedRemovedNotesLength and don't increment nextNoteIndexOffset
        else if(nextNoteLength < unplacedNoteLength - clickedNoteLength) {
          newContent[barIndex].notes.splice(clickedNoteIndex + nextNoteIndexOffset, 1)
          accumulatedRemovedNotesLength += nextNoteLength
        }

        // If the next note is longer, how much longer? Replace it with itself minus the difference
        else if(nextNoteLength > unplacedNoteLength - clickedNoteLength) {
          const lengthAsFraction = utils.floatToFraction(nextNoteLength - (unplacedNoteLength - clickedNoteLength))
          const note = newContent[barIndex].notes[clickedNoteIndex + nextNoteIndexOffset]
          const noteWithoutLength = note.split("]")[0] + "]"
          const noteWithNewLength = noteWithoutLength + lengthAsFraction
          newContent[barIndex].notes.splice(clickedNoteIndex + nextNoteIndexOffset, 1, noteWithNewLength)
        }
      }

      // Finally, add the unplacedNote
      const unplacedAbc = `[${utils.intendedNoteByMouseY(mouseOffset[1] * SVG_SCALE)}]${utils.floatToFraction(accumulatedRemovedNotesLength)}`
      newContent[barIndex].notes.splice(clickedNoteIndex, 0, unplacedAbc)
      console.log(JSON.stringify(newContent[barIndex].notes))
    }

    setContent(newContent)
  }

  // Assign event listeners
  useEffect(() => {
    if (svgRef !== null) {
      svgRef.current.onclick = clickHandler
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

      {/* Time signature */}
      <Note
        colorState="normal"
        SVG={NoteSVGs[utils.timeSignatureStringToSVGCtName[StaffProps.toolbarState.meter]]}
        scale={SVG_SCALE}
        x={51}
        y={0}
      />

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