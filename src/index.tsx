import * as React from "react"
import { render } from "react-dom"
import {
    Groove,
    GlobalStyle,
    Composer
} from "./components"

process.env.NODE_ENV === "development" && require("webpack-hot-middleware/client");

const App = () =>
    <React.Fragment>
        <GlobalStyle />
        <Composer />

        {/* <Groove
            timeSignature="2/4"
            basicAbcDrumsNotation="[!(.!!).!a]"
        /> */}
    </React.Fragment>

if (module && module.hot) {
    module.hot.accept();
}

render(<App />, document.querySelector("#app"));