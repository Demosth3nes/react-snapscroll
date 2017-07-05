import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFactors } from '../utils/functions';
export default class SnapScroll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userScroll : 0,
      position: 1,
      scrollTimer: -1,
      scrollDistance: 0,
      autoScroll: false
    }

    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.snapToScroll = this.snapToScroll.bind(this);
    this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
    this.childNodeList = [];
    this.scrollTimer = -1;
    this.throttleTimer = 0;
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
          style={index === this.state.position ? {color: 'red'} : null}
          >
          <h1>{index}</h1>
        </div>
      </div>
      )
    })

  }

  handleOnTouchStart(e) {
    this.setState({scrolling : true});
  }

  // handleOnTouchEnd(){
  //     console.log("here1");
  //     window.setTimeout(() => {
  //       console.log("here");
  //         if(!this.state.scrolling) {
  //
  //         }
  //       }, 1000);
  //     }

  snapToScroll(){

    const { userScroll, closestElement, container } = this.state;
    const { startBoundary, endBoundary, middleBoundary, index } = closestElement;

    if(userScroll === startBoundary){

    } else if(userScroll >=  middleBoundary) {
      container.scrollLeft = endBoundary;
      this.setState({position: index + 2, scrolling:false, userScroll: endBoundary});
    } else if(userScroll < middleBoundary) {
      container.scrollLeft = startBoundary;
      this.setState({position: index + 1, scrolling: false, userScroll: startBoundary});
    }


  }

  scrollToBoundary(container, boundary, direction) {

    this.setState({scrolling: true});
    if (direction === 'right') {

      const setInterval = window.setInterval(() => {
        if (this.state.userScroll !== boundary) {
          // let distance = boundary - this.state.userScroll;
          // let speed;
          // switch (distance) {
          //   case distance > 60:
          //     speed = 50
          //     break;
          //   case distance > 40:
          //   speed = 30;
          //     break;
          //   case distance < 40:
          //   speed = 1;
          //     break;
          //   default:
          //   speed = 1;
          //     break;
          // }

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
    const userScroll = e.target.scrollLeft;
    const container = e.target;

    let currentWidth = 0;

    const childBoundaries = this.childNodeList.map((item, index) => {

      currentWidth += item.offsetWidth;

      return {
        'startBoundary': currentWidth - item.offsetWidth,
        'middleBoundary': index === 0 ? item.offsetWidth / 2 : (currentWidth) - (item.offsetWidth / 2),
        'endBoundary': currentWidth,
         index
      };
    });

    childBoundaries.some((item, index) => {

      const endBoundary = item.endBoundary;
      const startBoundary = item.startBoundary;

      if (userScroll > startBoundary && userScroll < endBoundary) {
        this.setState((prevState) => {
          if(userScroll > prevState.userScroll) {

            return {
              userScroll,
              scrollDirection: 'right',
              childBoundaries,
              container,
              scrolling: true,
              closestElement : item
            }
          } else {
            this.position = index;
            return {
              userScroll,
              scrollDirection : 'left',
              childBoundaries,
              container,
              scrolling: true,
              closestElement : item
            }
          }
        });

        return true;
      }

      return false;
    });



      if (this.scrollTimer !== -1) {
          console.log(this.state.userScroll, this.state.container.scrollLeft);
        clearTimeout(this.scrollTimer);

      }

      this.scrollTimer = window.setTimeout(() => {
          this.snapToScroll();
      }, 100);

  }

  render() {
    return (
      <div>
        <div
          className={this.props.className}
          id={this.props.id}
          onScroll={this.handleOnScroll}
          onTouchStart={this.handleOnTouchStart}
          onTouchEnd={this.handleOnTouchEnd}
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
