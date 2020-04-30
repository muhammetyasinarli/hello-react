import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export class Main extends React.Component {
    render() {
        return <div>
            <ButtonGroup aria-label="Home Screen">
                <Button variant="secondary">Do stg.</Button>
                <Button variant="secondary">Do stg. else</Button>
                <Button variant="secondary">Do stg. else</Button>
            </ButtonGroup>
        </div>;
    }
}