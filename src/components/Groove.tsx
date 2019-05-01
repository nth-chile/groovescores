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

interface Props {
  timeSignature: string;
  basicAbcDrumsNotation: string;
}

const Groove = (Props) => {
    return (
      <Abc2SvgDrums
        basicAbcDrumsNotation={Props.basicAbcDrumsNotation}
        noteLength="1/4"
        showDrumsErrors
        timeSignature={Props.timeSignature}
      />
    )
}


export { Groove }

