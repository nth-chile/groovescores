import React, { useEffect, useState } from "react"
import styled from "styled-components"
import * as styles from "../../commonStyles"

interface Props {
  children: React.ReactNode;
  className?: string;
  handleClick: object;
}

const Unstyled = (Props) => {
  return (
    <button className={Props.className}>
      {Props.children}
    </button>
  )
}

const ToolbarButton = styled(Unstyled)<Props>`
  ${styles.openSansSmall}
  background-color: ${styles.colors.offwhite};
  box-sizing: border-box;
  border: 1px solid ${styles.colors.black};
  border-radius: 3px;
  cursor: pointer;
  display: inline-block;
  line-height: 8px;
  margin-right: 5px;
  padding: 9px;
  position: relative;

  &:last-child { margin-right: 0; }
`

export { ToolbarButton }