import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import throttle from "lodash/throttle"
import * as commonStyles from "../../commonStyles"
import {
  Button,
  Navbar,
  Staff,
  TagEditor,
  Toolbar
} from ".."

interface ComposerProps {
  className?: string;
}

const UnstyledComposer = (ComposerProps) => {
  const [noteType, setNoteType] = useState("note")
  const [noteLength, setNoteLength] = useState("1/4")

  const container = useRef(null)
  const xPadding = 66; // The x-padding of .groove

  useEffect(() => {
    console.log(noteType, noteLength)
  }, [noteType, noteLength])

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
    <>
      <Navbar />
      <div className={ComposerProps.className}>
        <div className="content">
          <Toolbar
            setNoteType={setNoteType}
            setNoteLength={setNoteLength}
          />

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
          <div className="text-right">
          <Button text="Publish"/>
        </div>
        </div>


        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" color="black" className="music" strokeWidth=".7" width="882px" height="78px">
          <path className="sW" d="m95.0 68.0v-21.0"></path>
          <text x="94.7" y="47.0"></text>
          <text x="87.8" y="68.0"></text>
          <path className="sW" d="m117.3 68.0v-21.0"></path>
          <text x="110.1" y="68.0"></text>
          <path className="sW" d="m161.9 68.0v-25.0"></path>
          <text x="161.6" y="46.5"></text>
          <text x="154.7" y="68.0"></text>
          <path className="sW" d="m177.6 68.0v-21.0"></path>
          <text x="170.4" y="68.0"></text>
        </svg>

      </div>
    </>
  )
}

const Composer = styled(UnstyledComposer)<ComposerProps>`
  ${commonStyles.basic}  
  ${commonStyles.openSans}
  margin: 0 85px;

  .content {
    max-width: 854px;
    margin-left: auto;
    margin-right: auto;
  }

  .groove {
    background-color: ${commonStyles.colors.offwhite};
    border-radius: 3px;
    ${commonStyles.boxShadow}
    margin-bottom: 17px;
    padding: 17px 33px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .music {
    font: 24px music;
    transform-origin: top left;
  }

  svg {
    overflow: visible;
  }
  
  .playBtn {
    margin-right: 16px;
    vertical-align: middle;
  }

  .toolbar {
    background-color: ${commonStyles.colors.offwhite};
    border-radius: 3px;
    ${commonStyles.boxShadow}
    margin-bottom: 17px;
    padding: 17px 33px;
    box-sizing: border-box;
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