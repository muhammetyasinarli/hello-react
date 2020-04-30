import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import { Main } from "./main";
import { Login } from "./login";
import { Counter } from "./counter";

export default function App() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Login</Link>
                    </li>
                    <li>
                        <Link to="/main">Main</Link>
                    </li>
                    <li>
                        <Link to="/counter">Counter</Link>
                    </li>
                </ul>

                <hr />

                {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
                <Switch>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    <Route path="/main">
                        <Main />
                    </Route>
                    <Route path="/counter">
                        <Counter
                        />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}