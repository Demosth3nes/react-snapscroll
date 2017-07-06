var scrollSnap = (function() {

  var container, childNodeList, scrolling = false, options = {};

  // After a user has finished scrolling, snap the user to the nearest snap point
  var snapToScroll = function(userScroll, childBoundaries) {
    var closestElement;
    childBoundaries.map(function(item, index){
      var middleBoundary = item.middleBoundary;
      var endBoundary = item.endBoundary;
      var startBoundary = item.startBoundary;

      if(userScroll > startBoundary && userScroll < endBoundary) {
        closestElement = item;
        return true;
      }
    });

    if(closestElement === undefined  || closestElement.startBoundary === userScroll){
      return false;
    }
    else if(userScroll >= closestElement.middleBoundary) {
      if(container.scrollLeft !== closestElement.endBoundary) {
        scrollToBoundary(userScroll, closestElement.endBoundary, 'right');
      }
    } else if(userScroll < closestElement.middleBoundary) {
      if(container.scrollLeft !== closestElement.startBoundary) {
        scrollToBoundary(userScroll, closestElement.startBoundary, 'left');
      }
    }

  }

  var getFactors = function (n) {
    var num_factors = [], i;

   for (i = 1; i <= Math.floor(Math.sqrt(n)); i += 1)
    if (n % i === 0)
    {
     num_factors.push(i);
     if (n / i !== i)
      num_factors.push(n / i);
    }
   num_factors.sort(function(x, y)
     {
       return x - y;});  // numeric sort
     return num_factors;
  }


  var scrollToBoundary = function(userScroll, boundary, direction) {

    scrolling = true;
    if(direction === "right"){

      var distance = boundary - userScroll;
      var speeds = getFactors(distance);

      var speed = distance < 120 ? 1 : speeds[1];

      var currentSpeed = speeds[1] && speeds[1] > 20 ? 1 : speeds[1];
      var setInterval = window.setInterval(function(){
          if(userScroll !== boundary) {
              userScroll += speed;
              container.scrollLeft += speed;
          } else {
          scrolling = false;
          clearInterval(setInterval);
          }
        }, 1 );

      } else {
        var setInterval = window.setInterval(function(){
            if(userScroll !== boundary) {

              userScroll -= 1;
                container.scrollLeft -= 1;
            } else {
            scrolling = false;
            clearInterval(setInterval);
            }
          }, 1 );
      }
    }

  return {

    init: function(containerId, childrenClassName, options) {
      container = document.getElementById(containerId);
      childNodeList = document.querySelectorAll(childrenClassName);
    },
    horizontalScroll: function() {

      var containerWidth = container.scrollWidth;
      var scrollTimer = -1;
      var currentWidth = 0

      var childBoundaries = Array.prototype.map.call(childNodeList, function(item, index) {
        currentWidth += item.offsetWidth;

        return {
          "startBoundary": currentWidth - item.offsetWidth,
          "middleBoundary":index === 0 ? item.offsetWidth / 2 : (currentWidth) - (item.offsetWidth / 2),
          "endBoundary": currentWidth,
        };
      });

      container.addEventListener('scroll', function(e) {
        var userScroll = this.scrollLeft;
        if(scrollTimer !== -1) {
          clearTimeout(scrollTimer);
        }

        if(!scrolling) {
          scrollTimer = window.setTimeout(function(){snapToScroll(userScroll, childBoundaries)}, 500 );
        }

      });
    }
  }

})();

var options = {
  speed: 'slow'
}
scrollSnap.init('snap-scroll-container-coordinates-centered', '.child', options);
scrollSnap.horizontalScroll();
