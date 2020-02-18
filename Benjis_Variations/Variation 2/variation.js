(function() {
  "use strict";
  // BC: track last scroll top position in variable to combat filter scroll jump
  var lastScrollTop = 0;

  // BC: function that toggles the "sort_hidden" class on the body depending on the value of remove argument
  function sortToggle(remove) {
    var sortClassName = 'sort_hidden'
    if (remove) {
      document.body.classList.remove(sortClassName)
    } else {
      document.body.classList.add(sortClassName)
    }
  }
  // BC: debounce function to limit the number of times a function fires. This prevents the scroll event firing the function on every single pixel and is better for performance (mostly on older devices)
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // BC: function to add the scroll listener to the window. Determines if the current scroll position is < or > the last scroll position and calls the sortToggle function
  function scrollListener() {
    window.addEventListener('scroll', debounce(function() {
      var st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop){
        // scroll up
        sortToggle(false)
      } else {
        // scroll down
        sortToggle(true)
      }
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }))
  }
  /**
     * Execute a callback when the DOM has loaded
     * @param {function} fn
     */

  function onDomReady(fn) {
    if (
      document.attachEvent
      ? document.readyState === "complete"
      : document.readyState !== "loading"
    ) {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }
  /**
     * Check if given variable is defined
     * @param {any} val - value to check if defined
     */

  function checkDefined(val) {
    return typeof val !== undefined && val !== null;
  }

  var config = {
    currentFilterShelfSelector: "#controlWrapper",
    isTesting: true,
    selectBoxPlacementTarget: {
      el: ".jdwOptionHolder",
      relPos: "afterbegin",
    },
    selectBoxTarget: {
      el: ".jdwOptionHolder select",
    },
  };

  function updateFakeSelectBox(fakeSelectBox, content) {
    fakeSelectBox.innerHTML = "<p>Sort: " + content + "</p>";
  }

  function setupSelectBox(selectBoxPlacementTarget, selectBoxTarget) {
    var fakeSelectBox = document.createElement("div");
    fakeSelectBox.id = "mn_fake_selectbox";
    selectBoxPlacementTarget.insertAdjacentElement(
      config.selectBoxPlacementTarget.relPos,
      fakeSelectBox
    );
    updateFakeSelectBox(
      fakeSelectBox,
      selectBoxTarget.selectedOptions[0].label
    );
    selectBoxTarget.addEventListener("change", function() {
      updateFakeSelectBox(
        fakeSelectBox,
        selectBoxTarget.selectedOptions[0].label
      );
    });
  }

  function setExpLoaded() {
    window.setTimeout(function() {
      document.querySelector("body").classList.add("plp_var_b_loaded");
    }, 500);
  }

  function run() {
    {
      document.querySelector("monetatepreview").remove();
    }
    var currentFilterShelf = document.querySelector(
      config.currentFilterShelfSelector
    ),
        selectBoxPlacementTarget = document.querySelector(
          config.selectBoxPlacementTarget.el
        ),
        selectBoxTarget = document.querySelector(config.selectBoxTarget.el);
    if (
      !checkDefined(currentFilterShelf) ||
      !checkDefined(selectBoxPlacementTarget) ||
      !checkDefined(selectBoxTarget)
    )
      return;
    setupSelectBox(selectBoxPlacementTarget, selectBoxTarget); // All loaded

    let body = document.querySelector('body');

    window.addEventListener('scroll', function () {
      if(window.scrollY > 3 && !body.classList.contains('sticky-filter')) {
        body.classList.add('sticky-filter');
      } else if (window.scrollY <= 3 && body.classList.contains('sticky-filter')) {
        body.classList.remove('sticky-filter');
      }
    });

    setExpLoaded();
    // BC: Called the scrollListener function here.
    scrollListener()
  }

  onDomReady(run);
})();
