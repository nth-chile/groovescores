import React from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import * as styles from "../commonStyles"

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Unstyled = (Props) => (
  ReactDOM.createPortal(
    <div className={Props.className}>
      {Props.children}
    </div>,
    document.getElementById("modal-root")
  )
)

export const Modal = styled(Unstyled)<Props>`
  ${styles.basic}
  ${styles.openSansSmall}
  background: ${styles.colors.white};
  ${styles.borderRadius}
  ${styles.boxShadow}
  padding: 19px;
  position: fixed;
  top: 12px;

  .controls {
    text-align: right;
    
    button:first-child {
      margin-right: 9px;
    }
  }
`