(function() {
    var isTesting = false;
    var _testID = "1001";
    var _trackerName = "Monetate_Custom_Tracking_".concat(_testID);
    var _customDimension = 18;
    var _eventCategory = "CRO Test Data";
    var _eventActionDetail = "1001-Test-BCohen-ExampleTestName-Control";
    var _trackingID = "UA-76601428-1";

    // * -----------------DO NOT EDIT BELOW THIS LINE----------------- * //
    function gaSendEvent(eventAction, eventLabel, impressionEvent) {
        var trackerExists =
            !!ga.getByName(_trackerName) ||
            ga("create", _trackingID, {
                name: _trackerName,
            });
        var event_object = {
            hitType: "event",
            eventCategory: _eventCategory,
            eventAction: ""
                .concat(_eventActionDetail, ": ")
                .concat(eventAction),
            eventLabel: eventLabel,
            eventValue: 0,
            nonInteraction: 1,
        };
        if (impressionEvent) {
            event_object["dimension".concat(_customDimension)] = ""
                .concat(_eventActionDetail, ": ")
                .concat(eventAction);
        }
        if (isTesting) {
            console.log(event_object);
        }
        ga(_trackerName + ".send", event_object);
    }
    function applyEventListeners() {
        // ** Apply event listeners here
        gaSendEvent("Loaded", "Variation Loaded", true);

        // BC: Sort By event listener
        document.querySelector('.customSortBy select').addEventListener('change', function(e) {
            var sort = document.querySelector('.customSortBy select');
            var SortVal = sort.children[sort.selectedIndex].textContent
            gaSendEvent("Click", "plp_sort: ".concat(SortVal), false);
        })

        let filterBtn = document.querySelector("#refineControl");
        if (filterBtn) {
            filterBtn.addEventListener("click", function() {
                gaSendEvent("Click", "plp_filter_open", false);
            });
        }
        let sortSelect = document.querySelector(".jdwOptionHolder select");
        if (sortSelect) {
            sortSelect.addEventListener("click", function() {
                gaSendEvent("Click", "plp_sort_open", false);
            });
        }

        function checkInView(el) {
            let dimensions = el.getBoundingClientRect();

            if (window.innerHeight > dimensions.y + dimensions.height) {
                return true;
            }
            return false;
        }

        let rows = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

        function trackOnScroll() {
            for (let i = 0; i < rows.length; i++) {
                let itemToFind = document.querySelectorAll(
                    "#mobileProductList .productFragment"
                )[rows[i] * 2 - 1];

                if (itemToFind && checkInView(itemToFind)) {
                    gaSendEvent(
                        "Impression",
                        "plp_scroll_row_" + rows[i],
                        true
                    );
                    rows.shift();
                } else {
                    break;
                }
            }

            if (!rows.length) {
                window.removeEventListener("scroll", trackOnScroll);
            }
        }

        window.addEventListener("scroll", trackOnScroll);

        // ** End event listeners
    }
    function trackingConditions() {
        return (
            typeof ga !== "undefined" &&
            document
                .querySelector("body")
                .classList.contains("plp_var_b_loaded")
        );
    }
    function pollForGA() {
        var pollInterval = 50;
        var pollLimit = 40;
        var x = 0;
        var waitForLoad = function waitForLoad() {
            if (trackingConditions()) {
                applyEventListeners();
            } else if (x < pollLimit) {
                x++;
                window.setTimeout(waitForLoad, pollInterval);
            }
        };
        window.setTimeout(waitForLoad, pollInterval);
    }

    window.mn_custom_ga = window.mn_custom_ga || [];
    var tracking_applied =
        window.mn_custom_ga[_eventActionDetail + " " + _trackingID];

    if (tracking_applied === true) {
        if (isTesting) {
            console.warn("Google Analytics test tracking code already applied");
        }
    } else {
        window.mn_custom_ga[_eventActionDetail + " " + _trackingID] = true;
        pollForGA();
    }
})();
