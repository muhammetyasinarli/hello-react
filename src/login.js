import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export class Login extends React.Component {
    render() {
        return <div>
            <ButtonGroup aria-label="Login">
                <Button variant="secondary">Entry</Button>
                <Button variant="secondary">Exit</Button>
                <Button variant="secondary">Help</Button>
            </ButtonGroup>
        </div>;
    }
}