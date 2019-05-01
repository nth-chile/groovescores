import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"

const SVG_HEIGHT = 67.5;
const SVG_WIDTH = 400;
const SVG_INITIAL_SCALE = 1.975;
const SVG_WIDTH_TIMES_SCALE = SVG_WIDTH * SVG_INITIAL_SCALE;
const SVG_HEIGHT_TIMES_SCALE = SVG_HEIGHT * SVG_INITIAL_SCALE;
const BAR_X_PADDING = 10; // Note section borders will stay this far from the edge of a bar
const CLEF_AND_TIME_SIG_WIDTH = 70; // Offset for the beginning edge of first note section

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
  const regex = /(?!])(\d+)(?:\/)*(\d+)*/;
  const matchArray = sections[sectionIndex].match(regex);
  return `${matchArray[1]}/${matchArray[2] || 1}`;
}

const UnstyledStaff = (props: { maxWidth: number, className?: string }) => {
  const [content, setContent] = useState(INITIAL_CONTENT);

  const staffLineWidthBeforeScale =
    SVG_WIDTH < props.maxWidth - (SVG_WIDTH_TIMES_SCALE - SVG_WIDTH) ?
    SVG_WIDTH - 1.5 :
    SVG_WIDTH * props.maxWidth / SVG_WIDTH_TIMES_SCALE - 1.5;

  const firstBarLinePosBeforeScale = 205.8 / 398.5 * staffLineWidthBeforeScale;

  const svgRef = useRef(null);

  useEffect(() => {
    console.log("hey")
    console.log('ok', svgRef.current.onclick)
    if (svgRef !== null) {
      
      svgRef.current.onclick = (e) => {
        // TODO: add condition for clicking wrong areas like time sig
        logSection(e.offsetX, e.offsetY)
      }

      return () => svgRef.current.onclick = null;
    }
  })

  const logSection = (x, y) => {
    x *= SVG_INITIAL_SCALE
    const firstBarLinePos = 205.8 / 398.5 * staffLineWidthBeforeScale * SVG_INITIAL_SCALE;

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
      writableBarWidth = (staffLineWidthBeforeScale * SVG_INITIAL_SCALE) - firstBarLinePos - (BAR_X_PADDING * 2)
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      color="black"
      className={`music ${props.className}`}
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
  )
}

const Staff = styled(UnstyledStaff)`
  transform: scale(${SVG_INITIAL_SCALE});
`

export { Staff }