import React, { Component } from "react";
import Abc2SvgDrums from "react-abc2svg-drums"

/*
Ghost Note	!(.!!).!note
Hi-Hat	^g
Crash	^c'
Stacker	^d'
Ride	^A'
Ride Bell	^B'
Cow Bell	^D'
Cross Stick	^c
Foot Splash	^d
*/

interface GrooveProps {
  timeSignature: string;
  noteLength: string;
  basicAbcDrumsNotation: string;
}

const Groove = (props) => {
    return (
      <Abc2SvgDrums
          {...props}
          showDrumsErrors
        />
    )
}


export { Groove }

