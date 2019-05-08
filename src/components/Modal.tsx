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
      <div className="modal">
        {Props.children}
      </div>
    </div>,
    document.getElementById("modal-root")
  )
)

export const Modal = styled(Unstyled)<Props>`
  ${styles.basic}
  ${styles.openSansSmall}
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(47, 47, 47, .5);

  .modal {
    background: ${styles.colors.white};
    ${styles.borderRadius}
    ${styles.boxShadow}
    margin: 19px;
    max-width: 30em;
    transform: translateX(-9.5px);
    padding: 19px;
    position: fixed;
    top: 19px;
  }

  .controls {
    text-align: right;
    
    button:first-child {
      margin-right: 9px;
    }
  }
`