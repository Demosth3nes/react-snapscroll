import React, { Component } from 'react';

export default class ChildNode extends Component {
  constructor(props){
    super(props);
      console.log(props.index);
  }

  render() {

    return (
      <div className="child">
          <div className="label"><h1>asdadsa</h1></div>
      </div>
    )
  }
}
