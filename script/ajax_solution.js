// COPY THIS TO AJAX.JS

// This will hold the list of locations
// that we want to show on the map
var loadedLocations;

// This will hold the time that the locations were lasted retrieved
var timeLastLoaded;

var count = 0;

// Load initial GPS locations
// when page is first opened
function load_initial() {
    console.log("loading updates...");

    // Initialise a request object
    // This is used to call URLs on the internet to perform a task
    // In this case, we will be using it to get GPS locations
    let request = new XMLHttpRequest();

    // This particular URL will query for the list of saved locations
    // that has been collected by the Particle Photon
    request.open("GET", "query.py", true);

    // request.onload - when the request query has finished sending a response successfully
    // readyState with a value of 4 indicates that the request has been completed
    // status refers to the HTTP response status, where 200 indicates success
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {

                // Prints the request response text into the browser console
                // this is good for debugging
                console.log(request.responseText)

                // Converts the response text into an object that you can use
                let data = JSON.parse(request.responseText);

                ////////////////////////////////////////////////////////////////////////
                // Write code here!
                //
                // We want to get the list of locations from the response text
                // and show them on the map - but only if there are locations
                // returned.
                //
                // We also want to get the time last loaded so we can use it to track
                // any new locations (since the last time we got the list of locations).
                // We don't want to have duplicate locations!
                //
                /// SOLUTION:

                // get the array of locations from the data object
                loadedLocations = data.locations;

                // set the time last loaded
                timeLastLoaded = Date.now() / 1000 + new Date().getTimezoneOffset() * 60;

                // only add markers if new locations were loaded
                if (loadedLocations.length > 0) {
                    addMarkers(loadedLocations);
                }
                count++;
                ////////////////////////////////////////////////////////////////////////


                // This will setup a timer to call load_updates every 15 seconds
                // (Note interval is in millseconds, which is why we need to
                //  calculate it as 15 seconds times 1000)
                window.setInterval(load_updates, 15 * 1000);

            // We will write an error to the browser console if the 
            // HTTP response status is not 200 (which indicated a failure)
            } else {
                console.error(request.statusText);
            }
        }
    };

    // request.onerror - when the request query ran into an error
    request.onerror = function (e) {
        console.error(request.statusText);
    };
    request.send(null);
}

// Load any new GPS locations
// this will run continuosly every 15 seconds from the window.setInterval function
// in the load_initial function above
function load_updates() {

    // Initialise the request object
    let request = new XMLHttpRequest();

    ////////////////////////////////////////////////////////////////////////
    // Tweak this line!
    //
    // This currently gets all the GPS locations
    // but we want to only get any new GPS locations recorded by the GPS
    // tracker. We will need to use the timeLastLoaded here
    //request.open("GET", "query.py", true);
    //
    // SOLUTION:
    // Add a query parameter called 't' with the value of the time last loaded
    request.open("GET", "query.py?t=" + timeLastLoaded.toString(), true);
    ////////////////////////////////////////////////////////////////////////

    // Similar to the above, when the query request has successfully
    // returned a response
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {

                // print to the browser console for debugging
                console.log(request.responseText);

                // convert the response text into an object
                let data = JSON.parse(request.responseText);

                ////////////////////////////////////////////////////////////////////////
                // Write code here!
                //
                // We want to get the list of locations from the response text
                // and show them on the map - but only if there are locations
                // returned.
                //
                // We also want to get the time last loaded so we can use it to track
                // any new locations (since the last time we got the list of locations).
                // We don't want to have duplicate locations!
                //
                // SOLUTION:
                loadedLocations = data.locations;

                timeLastLoaded = Date.now() / 1000 + new Date().getTimezoneOffset() * 60;
                if (loadedLocations.length > 0) {
                    addMarkers(loadedLocations);
                }
                count++;
                ////////////////////////////////////////////////////////////////////////
                
            } else {
                console.error(request.statusText);
            }
        }
    };
    request.onerror = function (e) {
        console.error(request.statusText);
    };
    console.log("loading updates...");
    request.send(null);
}