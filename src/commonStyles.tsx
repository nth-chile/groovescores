import { css } from "styled-components"

export const borderRadius = css`border-radius: 3px;`

export const colors = {
  black: "#2f2f2f",
  blue: "#00a6fb",
  green: "#23ce8b",
  grey: "#969392",
  offwhite: "#fbf5f3",
  red: "#ff6767",
  white: "#fbfbfb"
};

export const basic = css`
  color: ${colors.black};
  .text-right { text-align: right }
  .text-underline { text-decoration: underline }
  .opacity-7 { opacity: .7 }
`

export const boxShadow = css`
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
`

//////////////
///  Type  ///
//////////////

export const openSans = css`
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
`

export const openSansSmall = css`
  font-family: "Open Sans";
  font-size: 12px;
`

export const patuaOne30 = css`
  font-family: "Patua One", "Arial Black";
  font-size: 30px;
`

export const patuaOne18 = css`
  font-family: "Patua One", "Arial Black";
  font-size: 18px;
`