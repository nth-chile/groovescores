import * as React from "react";
import styled from "styled-components"

const HEIGHT = 67.5;
const INITIAL_SCALE = 1.5;
const WIDTH = 400;
const COMPUTED_HEIGHT = HEIGHT * INITIAL_SCALE;
const COMPUTED_WIDTH = WIDTH * INITIAL_SCALE;

const UnstyledStaff = (props: { maxWidth: number, className?: string }) => {

  const calculateHeight = () : string => {
    if (props.maxWidth < COMPUTED_WIDTH) {
      const number = HEIGHT * props.maxWidth / COMPUTED_WIDTH;
      return number + "px";
    }

    return HEIGHT + "px"
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      color="black"
      className={`music ${props.className}`}
      strokeWidth=".7"
      width={`${WIDTH}px`}
      height={calculateHeight()}
    >
      <path
        className="slW"
        d="M0,26 h398.5
          m-398.5 6 h398.5
          m-398.5,6 h398.5
          m-398.5,6 h398.5
          m-398.5,6 h398.5"
      >
      </path>
      <path className="bW" d="M398.5,50.0 v-24.0"></path>
      <path className="bW" d="M205.8,50.0 v-24.0"></path>
      <text x="6.5" y="38.0"></text>
      <g transform="translate(30.5,44.0)" textAnchor="middle">
      <text y="-12"></text>
      <text></text>
      </g>
    </svg>
  )
}

const Staff = styled(UnstyledStaff)`
  transform: scale(${
    props => 
      props.maxWidth < COMPUTED_WIDTH ?
      (props.maxWidth / COMPUTED_WIDTH) * INITIAL_SCALE :
      INITIAL_SCALE
  }); 
  border: 1px solid red;
`

export { Staff }