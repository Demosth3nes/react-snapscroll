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
    this.position = 0;
    this.scrollTimer = -1;
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
        <div className="label">
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
    });

    if (closestElement === undefined || closestElement.startBoundary === userScroll) {
      return false;
    } else if (userScroll >= closestElement.middleBoundary) {
      if (container.scrollLeft !== closestElement.endBoundary) {
        this.scrollToBoundary(container, userScroll, closestElement.endBoundary, 'right');
        this.position += 2;

      }
    } else if (userScroll < closestElement.middleBoundary) {
      if (container.scrollLeft !== closestElement.startBoundary) {
        this.scrollToBoundary(container, userScroll, closestElement.startBoundary, 'left');
        this.position += 1;
      }
    }
  }

  scrollToBoundary(container, userScroll, boundary, direction) {
    let scroll = userScroll;
    this.scrolling = true;
    if (direction === 'right') {
      // const distance = boundary - scroll;
      // const speeds = getFactors(distance);
      //
      // const speed = distance < 120 ? 1 : speeds[0];
      //
      // let currentSpeed = speeds[1] && speeds[1] > 20 ? 1 : speeds[1];
      const setInterval = window.setInterval(() => {
        if (scroll !== boundary) {
          scroll += 1;
          container.scrollLeft += 1;
        } else {
          this.scrolling = false;
          clearInterval(setInterval);
        }
      }, 1);
    } else {
      const setInterval = window.setInterval(() => {
        if (scroll !== boundary) {
          scroll -= 1;
          container.scrollLeft -= 1;
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
      };
    });


    this.setState((previousState, _) => {
      if(userScroll !== previousState.userScroll) {

      }
      return {userScroll};
    });


      if(this.scrollTimer !== -1) {
        clearTimeout(this.scrollTimer);
      }
        if (!this.scrolling) {
        this.scrollTimer = window.setTimeout(() => {
          this.snapToScroll(userScroll, childBoundaries, container);
        }, 1000);
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
   id: PropTypes.string,
}
