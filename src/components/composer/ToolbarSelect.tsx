import React, { useEffect, useState } from "react"
import styled from "styled-components"
import * as styles from "../../commonStyles"
//import console = require("console");

interface Props {
  className?: string;
  initialValue: string;
  disabled?: boolean;
  options: Array<string>;
  handleSelect: object;
}

const UnstyledToolbarSelect = (Props) => {
  const [selectedValue, setSelectedValue] = useState(Props.initialValue)
  const [isClosed, toggleClosed] = useState(true)

  const handleClick = (option) => {
    if (Props.disabled) return
    setSelectedValue(option)
    toggleClosed(!isClosed)
    Props.handleSelect(option.toLowerCase())
  }

  const handleToggleClosed = () => {
    if (Props.disabled) return
    toggleClosed(!isClosed)
  }

  return (
    <div className={`${Props.disabled && "opacity-7"} ${Props.className}`}>
      <svg className="dropdownArrow" xmlns="http://www.w3.org/2000/svg" width="11" height="6">
        <path fill="#363636" fillRule="nonzero" d="M10.54957758.62438761L5.58578604 5.78369514.62199447.6243877z"/>
      </svg>

      <div
        className="dropdownBox"
        onClick={handleToggleClosed}
      >{selectedValue}</div>

      <ul style={{ display: isClosed ? "none" : "inline-block" }}>
        {
          Props.options.map(option =>
            <li
              key={option}
              onClick={(e) => handleClick(option)}
            >
              {option}
            </li>
          )
        }
      </ul>
    </div>
  )
}

const ToolbarSelect = styled(UnstyledToolbarSelect)<Props>`
  ${styles.openSansSmall}
  box-sizing: border-box;
  border: 1px solid ${styles.colors.black};
  border-radius: 3px;
  cursor: ${Props => Props.disabled ? "not-allowed" : "pointer"};
  display: inline-block;
  margin-right: 5px;
  position: relative;

  &:last-child { margin-right: 0; }

  .dropdownBox {
    box-sizing: border-box;
    padding: 9px 21px 9px 9px;
    height: 26px;
    line-height: 8px;
  }

  .dropdownArrow {
    position: absolute;
    right: 5px;
    top: 10px;
  }

  ul {
    background-color: ${styles.colors.offwhite};
    border: 1px solid ${styles.colors.black};
    border-radius: 3px;
    list-style-type: none;
    margin: 0;
    padding: 0 12px 0 0;
    position: absolute;
    white-space: nowrap;
    left: -1px;
    top: -1px;
    z-index: 1;
  }

  li {
    line-height: 8px;
    padding: 9px;

    &:hover {
      text-decoration: underline;
    }
  }
`

export { ToolbarSelect }