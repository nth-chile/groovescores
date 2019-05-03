import React from "react";
import styled from "styled-components";
import * as styles from "../../commonStyles"

interface NoteProps {
  className?: string;
  colorState: "unplaced" | "normal" | "selected" | "hovered";
  scale: number;
  SVG: React.ReactNode;
  x: number;
  y: number;
}

const UnstyledNote = (NoteProps) => {
  return (
    <NoteProps.SVG
      className={NoteProps.className}
    />
    
    
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   version="1.1"
    //   // xmlns:xlink="http://www.w3.org/1999/xlink"
    //   color="black"
    //   className={`music ${NoteProps.className}`}
    //   strokeWidth=".7"
    //   height="46px"
    //   width="8px"
    //   // viewBox="0 0 8 46"
    // >
    //   <path className="sW" d="m7.2 21v-21.0"></path>
    //   <text y="21"></text>
    // </svg>
  )
}

const colorStateToHex = {
  unplaced: styles.colors.grey,
  normal: styles.colors.black,
  selected: styles.colors.blue,
  hovered: styles.colors.blue,
}

const Note = styled(UnstyledNote)`
  color: ${NoteProps => colorStateToHex[NoteProps.colorState]};
  position: absolute;
  left: ${NoteProps => NoteProps.x}px;
  top: ${NoteProps => NoteProps.y}px;
  transform: scale(${NoteProps => NoteProps.scale});
`;

export { Note }