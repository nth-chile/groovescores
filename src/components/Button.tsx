import React from "react";
import styled from "styled-components";
import * as styles from "../commonStyles"

interface Props {
  text: string;
  className: string;
}

const UnstyledButton = (Props) => {
    return (
      <button className={Props.className}>
        {Props.text}
      </button>
    )
}

const Button = styled(UnstyledButton)`
  background-color: ${styles.colors.blue};
  border: none;
  border-radius: 3px;
  color: ${styles.colors.offwhite};
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding: 9px;
`

export { Button }

