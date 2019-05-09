/*
  Takes an array of abc notes and returns the SVGs
*/

import React from "react"
import styled from "styled-components"
import { Note } from "."
import * as NoteSVGs from "./noteSVGs"
import * as utils from "../../utils"
//import console = require("console");

interface Props {
  className?: string;
  abc: string;
  SVGScale: number;
  x: number;
}

const Unstyled = (Props) => {
  const noteLength = utils.getNoteLengthAsFraction(Props.abc)
  const note = Props.abc.match(/(?!\[)(\w|\^|\')+/)[0]
  const y = utils.noteTopPosByAbcNote[note]
  let noteType = "note"

  if (Props.abc.match(/!\(.!!\).!/)) {
    noteType = "ghost note"
  }

  if (Props.abc[1] === "z") {
    noteType = "rest"
  }
  
  return <Note
    colorState="normal"
    ghostNote={noteType === "ghost note"}
    SVG={NoteSVGs[utils.optionsToSVGNoteCtName({ noteLength, noteType })]}
    scale={Props.SVGScale}
    x={Props.x}
    y={y}
  />
}

const AbcToSVGNote = styled(Unstyled)<Props>`
  border: 1px solid red;
`

export { AbcToSVGNote }