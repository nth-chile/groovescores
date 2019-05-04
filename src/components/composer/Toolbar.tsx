import React from "react"
import styled from "styled-components"
import * as styles from "../../commonStyles"
import { ToolbarSelect } from "."

interface ToolbarProps {
  className?: string;
  setNoteLength: object;
  setNoteType: object;
}

const UnstyledToolbar = (ToolbarProps) => {
  return (
    <div className={ToolbarProps.className}>
      <ToolbarSelect
        initialValue={"Note"}
        options={["Note", "Rest", "Ghost Note"]}
        handleSelect={ToolbarProps.setNoteType}
      />
      <ToolbarSelect
        initialValue={"1/4"}
        options={["1", "1/2", "1/4", "1/8", "1/16", "1/32"]}
        handleSelect={ToolbarProps.setNoteLength}
      />
    </div>
  )
}

const Toolbar = styled(UnstyledToolbar)<ToolbarProps>`
  ${styles.boxShadow}
  border-radius: 3px;
  margin-bottom: 19px;
  padding: 9px;
`

export { Toolbar }