export default class ScrollSnap {
  constructor(containerId, childrenClassName, options = {}) {
    this.container = document.getElementById(containerId);
    this.childNodeList = document.querySelectorAll(childrenClassName);
    this.scrolling = false;
    this.options = options;
    this.selected = 1;
  }

  snapToScroll(userScroll, childBoundaries, container) {
    let closestElement;
    let position;
    childBoundaries.map((item, index) => {
      const endBoundary = item.endBoundary;
      const startBoundary = item.startBoundary;

      if (userScroll > startBoundary && userScroll < endBoundary) {
        position = index;
        closestElement = item;
      }
    });

    if (closestElement === undefined || closestElement.startBoundary === userScroll) {
      return false;
    } else if (userScroll >= closestElement.middleBoundary) {
      if (this.container.scrollLeft !== closestElement.endBoundary) {
        this.scrollToBoundary(container, userScroll, closestElement.endBoundary, 'right');
        position += 2;
      }
    } else if (userScroll < closestElement.middleBoundary) {
      if (this.container.scrollLeft !== closestElement.startBoundary) {
        this.scrollToBoundary(container, userScroll, closestElement.startBoundary, 'left');
        position += 1;
      }
    }

  }

  getFactors(n) {
    const numFactors = [];
    let i;

    for (i = 1; i <= Math.floor(Math.sqrt(n)); i += 1) {
      if (n % i === 0) {
        numFactors.push(i);
        if (n / i !== i) {
          numFactors.push(n / i);
        }
      }
    }
    numFactors.sort((x, y) => {
      return x - y;
    }); // numeric sort

    return numFactors;
  }

  scrollToBoundary(container, userScroll, boundary, direction) {
    let scroll = userScroll;
    this.scrolling = true;
    if (direction === 'right') {
      const distance = boundary - scroll;
      const speeds = this.getFactors(distance);

      const speed = distance < 120 ? 1 : speeds[0];

      // let currentSpeed = speeds[1] && speeds[1] > 20 ? 1 : speeds[1];
      const setInterval = window.setInterval(() => {
        if (scroll !== boundary) {
          scroll += speed;
          container.scrollLeft += speed;
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

  horizontalScroll() {
    let scrollTimer = -1;
    let currentWidth = 0;

    const childBoundaries = Array.prototype.map.call(this.childNodeList, (item, index) => {
      currentWidth += item.offsetWidth;

      return {
        'startBoundary': currentWidth - item.offsetWidth,
        'middleBoundary': index === 0 ? item.offsetWidth / 2 : (currentWidth) - (item.offsetWidth / 2),
        'endBoundary': currentWidth,
      };
    });

    this.container.addEventListener('scroll', (e) => {
      const userScroll = e.target.scrollLeft;
      const container = e.target;
      if (scrollTimer !== -1) {
        clearTimeout(scrollTimer);
      }

      if (!this.scrolling) {
        scrollTimer = window.setTimeout(() => {
          this.snapToScroll(userScroll, childBoundaries, container);
        }, 100);
      }
    });
  }

}

const scrollSnap = new ScrollSnap('snap-scroll-container-coordinates-centered', '.child');
scrollSnap.horizontalScroll();
