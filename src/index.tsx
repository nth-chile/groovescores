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

        <Groove
            timeSignature="4/4"
            basicAbcDrumsNotation="z/8z/4z/2zz2z4"
        />
    </React.Fragment>

if (module && module.hot) {
    module.hot.accept();
}

render(<App />, document.querySelector("#app"));