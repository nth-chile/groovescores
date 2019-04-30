import * as React from "react";
import styled from "styled-components";

const UnstyledQuarterNote = (props: { light: boolean }) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    // xmlns:xlink="http://www.w3.org/1999/xlink"
    color="black"
    className="music"
    strokeWidth=".7"
    height="46px"
    width="8px"
    viewBox="0 0 8 46"
  >
    <path className="sW" d="m7.2 21v-21.0"></path>
    <text y="21"></text>
  </svg>

// interface QuarterNoteProps {
//   light: boolean
// }

const QuarterNote = styled(UnstyledQuarterNote)`
  display: none;
`;

export { QuarterNote }