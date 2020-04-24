import React, { useState } from "react"
import styled from "styled-components"
import * as styles from "../../commonStyles"
import { ToolbarButton, ToolbarSelect } from "."
import { Button, Modal } from ".."

interface ToolbarProps {
  className?: string;
  setMeter: object;
  setNoteLength: object;
  setNoteType: object;
  setToolType: object;
  toolType: string;
}

const UnstyledToolbar = (ToolbarProps) => {
  const [isModalShown, setIsModalShown] = useState(false)
  const [didConfirmTimeSigSelect, setDidConfirmTimeSigSelect] = useState(false)
  const [selectedTimeSig, setSelectedTimeSig] = useState(null)

  const bodyClasslist = document.querySelector('body').classList;

  const handleCancelTimeSigSelect = () => {
    bodyClasslist.remove('overflow-hidden')
    setIsModalShown(false)
  }

  const handleTimeSigSelect = (timeSig) => {
    bodyClasslist.add('overflow-hidden')
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
          initialValue={"Add tool"}
          options={["Add tool", "Select tool"]}
          handleSelect={ToolbarProps.setToolType}
        />
        <ToolbarSelect
          initialValue={"4/4"}
          options={["4/4", "2/4", "3/4", "6/8"]}
          handleSelect={handleTimeSigSelect}
        />

        {
          ToolbarProps.toolType === "add tool" &&
          <>
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
          </>
        }

        {
          ToolbarProps.toolType === "select tool" &&
          <>
            <ToolbarButton>Subtract Grace Note</ToolbarButton>
            <ToolbarButton>Add Grace Note</ToolbarButton>
            <ToolbarButton>open hi hat or rim click</ToolbarButton>
            <ToolbarSelect
              disabled
              initialValue={"Closed Hi-hat"}
              options={["Open Hi-hat", "Closed Hi-hat"]}
              handleSelect={ToolbarProps.setNoteVariation}
            />
            {/* <ToolbarSelect
              initialValue={"Regular"}
              options={["Regular", "Cross stick"]}
              handleSelect={ToolbarProps.setNoteVariation}
            /> */}
            <ToolbarButton>Remove Note</ToolbarButton>
          </>
        }
        
      </div>

      {
        isModalShown && (
          <Modal>
            <p>Changing the time signature will clear the staff content. Are you sure you want to do that?</p>
            <div className="controls">
              <Button onClick={handleCancelTimeSigSelect} text="Cancel" />
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