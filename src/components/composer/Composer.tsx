import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import throttle from "lodash/throttle"
import * as commonStyles from "../../commonStyles"
import {
  QuarterNote,
  Staff,
  TagEditor
} from "../index"

const UnstyledComposer = (props) => {
  const container = useRef(null)
  const xPadding = 66; // The x-padding of .groove

  const resizeHandler = useCallback(throttle(() => {
    setContainerWidth(container.current.clientWidth)
  }, 200), [])

  const [containerWidth, setContainerWidth] = useState(undefined)

  useEffect(() => {
    if (!containerWidth) {
      setContainerWidth(container.current.clientWidth)
    }

    window.addEventListener("resize", resizeHandler)

    return () => {
      window.removeEventListener("resize", resizeHandler)
    }
  })

  return (
    <div className={props.className}>
      <div className="groove" ref={container}>
        <div className="opacity-7">by <span className="text-underline">user</span></div>
        <Staff maxWidth={containerWidth - xPadding} />
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="44" className="playBtn">
            <g fill="none" fillRule="nonzero">
              <ellipse cx="22.5" cy="21.8509615" fill="#00A6FB" rx="22.5" ry="21.8509615"/>
              <path fill="#FBF5F3" d="M30.849213 23.1993811l-13.5484425 7.2169782c-.609303.3245632-1.366351.093736-1.6909142-.5155669-.09636-.1808967-.1467595-.382713-.1467595-.5876736V14.8791624c0-.6903559.5596441-1.25 1.25-1.25.2049607 0 .4067769.0503995.5876737.1467595l13.5484425 7.2169782c.6093029.3245632.8401301 1.0816112.5155669 1.6909142-.1168018.2192721-.2962948.3987651-.5155669.5155668z"/>
            </g>
          </svg>

          <TagEditor />
        </div>
      </div>
    </div>
  )
}

const Composer = styled(UnstyledComposer)`
  ${commonStyles.global}  
  ${commonStyles.openSans}

  .groove {
    border-radius: 3px;
    ${commonStyles.boxShadow}
    height: 202px;
    max-width: 854px;
    padding: 17px 33px;
  }
  .music {
    font: 24px music;
    transform-origin: top left;
  }
  
  .playBtn {
    margin-right: 16px;
    vertical-align: middle;
  }

  text, tspan {
    fill: currentColor;
  }
  .stroke {
    stroke: currentColor;
    fill: none;
  }
  .bW {
    stroke: currentColor;
    fill: none;
    strokeWidth: 1;
  }
  .bthW {
    stroke: currentColor;
    fill: none;
    strokeWidth: 3;
  }
  .slW {
    stroke: currentColor;
    fill: none;
    strokeWidth: .7;
  }
  .slthW {
    stroke: currentColor;
    fill: none;
    strokeWidth: 1.5;
  }
  .sW {
    stroke: currentColor;
    fill: none;
    strokeWidth: .7;
  }
`;

export { Composer }