import React from "react"
import styled from "styled-components"
import * as commonStyles from "../commonStyles"

const UnstyledTagEditor = (props) =>
  <div className={props.className}>
    Tags (eg., rock, 4/4, rideless)
  </div>

const TagEditor = styled(UnstyledTagEditor)`
  ${commonStyles.boxShadow}
  ${commonStyles.openSansSmall}

  border-radius: 2px;
  display: inline-block;
  opacity: .7;
  padding: 5px 9px;
  width: 250px;
`

export { TagEditor }