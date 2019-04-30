import * as React from "react";
import styled from "styled-components"

const SVG_HEIGHT = 67.5;
const SVG_WIDTH = 400;
const SVG_INITIAL_SCALE = 1.5;
const SVG_COMPENSATED_WIDTH = SVG_WIDTH * SVG_INITIAL_SCALE;
const SVG_COMPENSATED_HEIGHT = SVG_HEIGHT * SVG_INITIAL_SCALE;

const UnstyledStaff = (props: { maxWidth: number, className?: string }) => {

  const staffLineWidth =
    SVG_WIDTH < props.maxWidth - (SVG_COMPENSATED_WIDTH - SVG_WIDTH) ?
    SVG_WIDTH - 1.5 :
    SVG_WIDTH * props.maxWidth / SVG_COMPENSATED_WIDTH - 1.5;

  const firstBarLinePos = 205.8 / 398.5 * staffLineWidth;

  console.log(`
  SVG_COMPENSATED_WIDTH: ${SVG_COMPENSATED_WIDTH}
  staffLineWidth: ${staffLineWidth}
  props.maxWidth: ${props.maxWidth}
  `)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      color="black"
      className={`music ${props.className}`}
      strokeWidth=".7"
      width={`${SVG_WIDTH}px`}
      height={`${SVG_COMPENSATED_HEIGHT}px`}
    >
      <path
        className="slW"
        d={`M0,26 h${staffLineWidth}
          m-${staffLineWidth} 6 h${staffLineWidth}
          m-${staffLineWidth},6 h${staffLineWidth}
          m-${staffLineWidth},6 h${staffLineWidth}
          m-${staffLineWidth},6 h${staffLineWidth}`}
      >
      </path>
      <path className="bW" d={`M${staffLineWidth},50.0 v-24.0`}></path>
      <path className="bW" d={`M${firstBarLinePos},50.0 v-24.0`}></path>
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