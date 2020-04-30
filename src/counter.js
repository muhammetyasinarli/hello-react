import React from "react";
import Proptypes from "prop-types";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "./styles/main.css";

export class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counterVal: 0
        };
        this.increase = this.increase.bind(this);
        this.decrease = this.decrease.bind(this);
        this.reset = this.reset.bind(this);
    }

    increase() {
        this.setState({
            counterVal: this.state.counterVal + 1
        });
    }
    decrease() {
        this.setState({
            counterVal: this.state.counterVal - 1
        });
    }
    reset() {
        this.setState({
            counterVal: 0
        });
    }

    render() {
        return <div>
            <h1>{this.props.counterHeader} {this.state.counterVal}</h1>
            <ButtonGroup>
                <Button variant="primary" className="fxWidth" onClick={this.increase}>Increase</Button>
                <Button variant="primary" className="fxWidth"  onClick={this.decrease}>Decrease</Button>
                <Button variant="primary" className="fxWidth"  onClick={this.reset}>Reset</Button>
            </ButtonGroup>
        </div>;
    }
}
Counter.propTypes = {
    counterHeader: Proptypes.string.isRequired

};
Counter.defaultProps = {
    counterHeader: "Counter Value : "
};