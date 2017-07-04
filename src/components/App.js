import React, { Component } from 'react';
import SnapScroll from './snap-scroll';

import '../css/App.css';

export default class App extends Component {

  render() {
    return (
      <div>
        <SnapScroll options={{children:8}}/>
      </div>
    );
  }

}
