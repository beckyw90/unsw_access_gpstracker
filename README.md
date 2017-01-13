# unsw_access_gpstracker
GPS Tracker Activity for UNSW CSE ACCESS

Setup instructions:

1. Clone the git repository to a CGI directory (e.g. `cgi-bin` or `public_html`).
2. Run `init.sh`

Usage:
* add GPS coordinates by sending a HTTP POST request to `add.py?lat=<latitude coords>&lng=<longitude coords>`. The script will respond with a `Added` message if the coordinates are registered successfully.
* load `index.html` on a web browser on your computer. Your coordinates will appear on a Google Maps embedded window. The website will automatically update with new coordinates every 15 seconds.
