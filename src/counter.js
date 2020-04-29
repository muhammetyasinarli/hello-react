import React from 'react'
import Proptypes from 'prop-types'

export class Counter extends React.Component {
    constructor(props) 
    {
        super(props);
        this.state ={
            counterVal : 0
        }
        this.increase = this.increase.bind(this);
        this.decrease = this.decrease.bind(this);
        this.reset = this.reset.bind(this);
    }

    increase(){
        this.setState({
            counterVal :this.state.counterVal + 1
        });
    }
    decrease(){
        this.setState({
            counterVal :this.state.counterVal - 1
        });
    }
    reset(){
        this.setState({
            counterVal :0
        });
    }

    render() {
        return <div>
            <h1>{this.props.counterHeader} {this.state.counterVal}</h1>
            <button onClick={this.increase}>Increase</button>
            <button onClick={this.decrease}>Decrease</button>
            <button onClick={this.reset}>Reset</button>
        </div>
    }
}
Counter.propTypes={
    counterHeader:Proptypes.string.isRequired

}
Counter.defaultProps  ={
    counterHeader:"Counter Value : "
}