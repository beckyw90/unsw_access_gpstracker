var loadedLocations;
var timeLastLoaded;
var count = 0;

// Load initial GPS locations
function load_initial() {
    console.log("loading updates...");
    let request = new XMLHttpRequest();
    request.open("GET", "query.py", true);
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                console.log(request.responseText)
                let data = JSON.parse(request.responseText);
                loadedLocations = data.locations;
                timeLastLoaded = Date.now() / 1000 + new Date().getTimezoneOffset() * 60;
                if (loadedLocations.length > 0) {
                    addMarkers(loadedLocations);
                }
                // Schedule next update
                count++;
                // document.getElementById('counter').innerHTML += new Date().toLocaleString() + '</br>';
                window.setInterval(load_updates, 15000);
            } else {
                console.error(request.statusText);
            }
        }
    };
    request.onerror = function (e) {
        console.error(request.statusText);
    };
    request.send(null);
}

function load_updates() {
    let request = new XMLHttpRequest();
    request.open("GET", "query.py?t=" + timeLastLoaded.toString(), true);
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                console.log(request.responseText);
                let data = JSON.parse(request.responseText);
                loadedLocations = data.locations;
                timeLastLoaded = Date.now() / 1000 + new Date().getTimezoneOffset() * 60;
                if (loadedLocations.length > 0) {
                    addMarkers(loadedLocations);
                }
                count++;
                // document.getElementById('counter').innerHTML += new Date().toLocaleString() + '</br>';
                // Schedule next update
                // window.setInterval(load_updates, 5000);
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