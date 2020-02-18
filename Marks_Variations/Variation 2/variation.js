(function() {
    "use strict";
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
    }

    onDomReady(run);
})();
