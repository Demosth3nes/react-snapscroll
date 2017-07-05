import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFactors } from '../utils/functions';
export default class SnapScroll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userScroll : 0
    }

    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.snapToScroll = this.snapToScroll.bind(this);

    this.childNodeList = [];
    this.selected = 1;
    this.scrolling = false;
    this.position = 1;
    this.scrollTimer = -1;
  }

  componentDidMount() {
    // this.childNodeList;
  }

  renderChildNodes() {
  let childrenArray = Array.apply(null, {length: this.props.options.children}).map(Number.call, Number);

  return childrenArray.map((_, index) => {
    return (
      <div
        className="child"
        key={index}
        ref={(input) => { this.childNodeList[index] = input; }}
        >
        <div
          className="label"
          style={index === this.position ? {color: 'red'} : null}
          >
          <h1>{index}</h1>
        </div>
      </div>
      )
    })

  }

  snapToScroll(userScroll, childBoundaries, container){

    let closestElement;

    childBoundaries.some((item, index) => {
      const endBoundary = item.endBoundary;
      const startBoundary = item.startBoundary;
      if (userScroll > startBoundary && userScroll < endBoundary) {
        this.position = index;
        closestElement = item;
        return true;
      }

      return false;
    });

    if (closestElement === undefined || closestElement.startBoundary === userScroll) {
      return false;
    } else if (userScroll >= closestElement.middleBoundary) {
      if (container.scrollLeft !== closestElement.endBoundary) {
        this.scrollToBoundary(container, closestElement.endBoundary, 'right');
        this.position += 2;

      }
    } else if (userScroll <= closestElement.middleBoundary) {
      if (container.scrollLeft !== closestElement.startBoundary) {
        this.scrollToBoundary(container, closestElement.startBoundary, 'left');
        this.position += 1;
      }
    }
  }

  scrollToBoundary(container, boundary, direction) {
    this.scrolling = true;

    if (direction === 'right') {

      const setInterval = window.setInterval(() => {
        if (this.state.userScroll !== boundary) {
          let distance = boundary - this.state.userScroll;
          let speed;
          switch (distance) {
            case distance > 60:
              speed = 50
              break;
            case distance > 40:
            speed = 30;
              break;
            case distance < 40:
            speed = 1;
              break;
            default:
            speed = 1;
              break;
          }

          container.scrollLeft = boundary;

          this.setState({userScroll : boundary});
        } else {
          this.scrolling = false;
          clearInterval(setInterval);
        }
      }, 1);
    } else {
      const setInterval = window.setInterval(() => {
        if (this.state.userScroll !== boundary) {

          container.scrollLeft = boundary;

          this.setState({userScroll : boundary});
        } else {
          this.scrolling = false;
          clearInterval(setInterval);
        }
      }, 1);
    }
  }

  handleOnScroll(e) {
    // if(this.scrolling) {
    //   e.preventDefault();
    //   e.stopPropagation();
    //     clearTimeout(this.scrollTimer);
    //   return false;
    //
    // }


    const userScroll = e.target.scrollLeft;
    // console.log(userScroll);
    const container = e.target;
    let currentWidth = 0;

    const childBoundaries = this.childNodeList.map((item, index) => {

      currentWidth += item.offsetWidth;

      return {
        'startBoundary': currentWidth - item.offsetWidth,
        'middleBoundary': index === 0 ? item.offsetWidth / 2 : (currentWidth) - (item.offsetWidth / 2),
        'endBoundary': currentWidth,
      };
    });

    childBoundaries.some((item, index) => {
      const endBoundary = item.endBoundary;
      const startBoundary = item.startBoundary;
      if (userScroll > startBoundary && userScroll < endBoundary) {
        this.setState((prevState, props) => {
          if(userScroll > prevState.userScroll) {
            this.position = index+2;
            return {userScroll, scrollDirection : 'right'}
          } else {
            this.position = index+1;
            return {userScroll, scrollDirection : 'left'}
          }
        });
        console.log(userScroll);

        return true;
      }

      return false;
    });



      if(this.scrollTimer !== -1) {
        clearTimeout(this.scrollTimer);
      }
        if (!this.scrolling) {
        this.scrollTimer = window.setTimeout(() => {
          this.snapToScroll(userScroll, childBoundaries, container);
        }, 200);
      }
  }


  render() {
    return (
      <div>
        <div
          className={this.props.className}
          id={this.props.id}
          onScroll={this.handleOnScroll}
          >
          {this.renderChildNodes()}
        </div>
      </div>
    )
  }
}

SnapScroll.propTypes = {
   options: PropTypes.object.isRequired,
   className: PropTypes.string,
   id: PropTypes.string
}
