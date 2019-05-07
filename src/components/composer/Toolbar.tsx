import React, { useState } from "react"
import styled from "styled-components"
import * as styles from "../../commonStyles"
import { ToolbarSelect } from "."
import { Button, Modal } from ".."

interface ToolbarProps {
  className?: string;
  setMeter: object;
  setNoteLength: object;
  setNoteType: object;
}

const UnstyledToolbar = (ToolbarProps) => {
  const [isModalShown, setIsModalShown] = useState(false)
  const [didConfirmTimeSigSelect, setDidConfirmTimeSigSelect] = useState(false)
  const [selectedTimeSig, setSelectedTimeSig] = useState(null)

  const handleTimeSigSelect = (timeSig) => {
    setIsModalShown(true)
    setSelectedTimeSig(timeSig)
  }

  const handleConfirmTimeSigSelect = () => {
    setIsModalShown(false)
    ToolbarProps.setMeter(selectedTimeSig)
  }

  return (
    <>
      <div className={ToolbarProps.className}>
        <ToolbarSelect
          initialValue={"4/4"}
          options={["4/4", "2/4", "3/4", "6/8"]}
          handleSelect={handleTimeSigSelect}
        />
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

      {
        isModalShown && (
          <Modal className="modal">
            <p>Changing the time signature will clear the staff content.</p>
            <div className="controls">
              <Button onClick={() => setIsModalShown(false)} text="Cancel" />
              <Button onClick={handleConfirmTimeSigSelect} text="Ok" />
            </div>
          </Modal>
        )
      }
    </>
  )
}

const Toolbar = styled(UnstyledToolbar)<ToolbarProps>`
  ${styles.boxShadow}
  ${styles.borderRadius}
  margin-bottom: 19px;
  padding: 9px;
`

export { Toolbar }