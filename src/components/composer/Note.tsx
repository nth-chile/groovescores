import React from "react";
import styled from "styled-components";
import * as styles from "../../commonStyles"

interface NoteProps {
  className?: string;
  colorState: "unplaced" | "normal" | "selected" | "hovered";
  ghostNote: boolean;
  scale: number;
  SVG: React.ReactNode;
  x: number;
  y: number;
}

const UnstyledNote = (NoteProps) =>
  <NoteProps.SVG
      className={NoteProps.className}
      ghostNote={NoteProps.ghostNote}
      y={NoteProps.y} // Pass y coordinate to individual note, to make proper vertical position adjustments
  />

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
  transform: scale(${NoteProps => NoteProps.scale});
  transform-origin: top left;
`;

export { Note }