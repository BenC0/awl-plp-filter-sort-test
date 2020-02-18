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
				sortToggle(false)
			} else {
				sortToggle(true)
			}
			lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
		}))
	}
    /**
     * Safely get value of a deeply nested property
     * @param {object} obj - Object to traverse
     * @param {string} propertyPathString - path to traverse represented as a string
     * @param {any} returnIfNotFound - value to return if propertly not found
     */

    function getNestedProperty(obj, propertyPathString, returnIfNotFound) {
        // * Split path string
        var properties = propertyPathString.split("."); // * Loop over object

        for (var i = 0; i < properties.length; i++) {
            var prop = properties[i];

            if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
                // * Return desired return
                return returnIfNotFound;
            }

            obj = obj[prop];
        } // * Return found item

        return obj;
    }
    /**
     *  Extends the Element object with class toggle functionality
     */

    function addClassToggleToElements() {
        /**
         * Toggle class on element
         * @param {string} className - class to toggle
         */
        Element.prototype.toggleClass = function toggleClass(className) {
            var cl = this.classList;
            cl.contains(className) ? cl.remove(className) : cl.add(className);
        };
    }
    /**
     *  Improved version of document.createElement, taking in type and object with options
     */

    function buildElement(elementType, options) {
        if (!Element.prototype.toggleClass) {
            addClassToggleToElements();
        }

        var newElement = document.createElement(elementType); // if (typeof options !== "object" || options instanceof Array)
        //     return undefined;

        var classes = getNestedProperty(options, "classes", false);
        var attributes = getNestedProperty(options, "attributes", false);
        var id = getNestedProperty(options, "id", false);

        if (classes.length) {
            classes.forEach(function(c) {
                return newElement.toggleClass(c);
            });
        }

        if (attributes.length) {
            attributes.forEach(function(a) {
                return newElement.toggleClass(a);
            });
        }

        if (id) {
            newElement.id = id;
        }

        return newElement;
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
        placementTarget: {
            el: ".site-canvas",
            relPos: "beforeend",
        },
        isTesting: true,
        selectBoxPlacementTarget: {
            el: ".jdwOptionHolder",
            relPos: "afterbegin",
        },
        selectBoxTarget: {
            el: ".jdwOptionHolder select",
        },
    };

    function insertShelf(placementTarget, currentFilterShelf, newfilterShelf) {
        placementTarget.insertAdjacentElement(
            config.placementTarget.relPos,
            newfilterShelf
        );
        newfilterShelf.insertAdjacentElement("afterbegin", currentFilterShelf);
    }

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
            document.querySelector("body").classList.add("plp_var_a_loaded");
        }, 500);
    }

    function run() {
        {
            document.querySelector("monetatepreview").remove();
        }
        var newfilterShelf = buildElement("div", {
                id: "mn_filter_shelf",
            }),
            currentFilterShelf = document.querySelector(
                config.currentFilterShelfSelector
            ),
            placementTarget = document.querySelector(config.placementTarget.el),
            selectBoxPlacementTarget = document.querySelector(
                config.selectBoxPlacementTarget.el
            ),
            selectBoxTarget = document.querySelector(config.selectBoxTarget.el);
        if (
            !checkDefined(placementTarget) ||
            !checkDefined(currentFilterShelf) ||
            !checkDefined(selectBoxPlacementTarget) ||
            !checkDefined(selectBoxTarget)
        )
            return;
        insertShelf(placementTarget, currentFilterShelf, newfilterShelf);
        setupSelectBox(selectBoxPlacementTarget, selectBoxTarget); // All loaded

        setExpLoaded();
        // BC: Called the scrollListener function here.
        scrollListener()
    }

    onDomReady(run);
})();
