

// This #include statement was automatically added by the Particle IDE.
#include "SparkIntervalTimer/SparkIntervalTimer.h"

// This #include statement was automatically added by the Particle IDE.
#include "ParticleSoftSerial/ParticleSoftSerial.h"

// This #include statement was automatically added by the Particle IDE.
#include "HttpClient/HttpClient.h"

// This #include statement was automatically added by the Particle IDE.
#include "TinyGPS++/TinyGPS++.h"





// GPS variables
static const int RXPin = 3, TXPin = 4;
static const uint32_t GPSBaud = 9600;
static int GPSRetryCooldown = 5000;

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);





int next_time;

void setup()
{
    // Initialise the serial connection. The documentation for this chip says that it's baud rate (speed) is
    // 9600 bytes per second and the SoftwareSerial code needs to know this.
    ss.begin(GPSBaud);
    
    // This serial connection goes through the USB cable to our computer. This way we can print messages
    // and see the text on our screen. This is handy for debugging so we can see what is going on.
    // This one can have a higher baud rate so lots of prints won't really slow everythibng down.
    // 115200 is a common "fast enough" serial baud rate.
    Serial.begin(115200);
    
    
    // initialise the time we want to log with the current time.
    next_time = millis();

    Serial.println(F("Davidm HACKS! so nice"));
    Serial.println();
}

#define DO_PRINT 0



void loop()
{
    // see if there's characters to read from the GPS. 
    // If not, there's nothing to do for now so we can just return.
    if (!ss.available()) {
        return;
    }
    
    // We have something available, so read it
    int character = ss.read();
    
    // displaying every character is useful for debugging but we might not always want it as
    // otherwise it can get pretty spammy.
    if (DO_PRINT) {
        if (character != '\r') {
            Serial.print((char)character);
        }
    }
    
    // Give the character we just read to the gps encoder. 
    // This is what does all the hard/annoying work of converting the NEMA sentences we get from the GPS chip
    // into human readable values like dates, times and longitudes/latitudes.
    //
    // The encode() function returns True if enough characters have been gathered that  it has learned something new
    // from the GPS. If returns false, then there's nothing for us to do right now except wait for more data. So in that
    // case we just return immediately and try again next time.
    if (!gps.encode(character)) {
        return;
    }
        
    
    // If we get this far, a complete line from the GPS has been processed.
    // (Not all lines are intersting to us right now: some describe altitude, or number of sattelites in view, etc)
    
    
    // We only want to log our position once per second, and some GPS chips might send data much faster than that.
    // So if 1000 milliseconds haven't yet passed since last time we sent a position, we can just exit.

    int now = millis();
    if (now < next_time) {
        // not yet time, nothing to do.
        // Serial.print(now); Serial.print(" < "); Serial.println(next_time);
        return;
    }

    // schedule the next reporting time for 1 second from now
    next_time += 1000;


    // Check if the time is both valid and recently updated since last time. If so print out the time.
    if (gps.time.isValid() && gps.time.isUpdated()) {
        printTime();
    }

    // Likewise, see if we have a location yet.
    if (gps.location.isValid()) {
        // and see if it's been updated since last time
        if (gps.location.isUpdated()) {
            printLocation();
            uploadLoc();
        }
    } else {
        // GPS is invalid.. lets be polite and print a periodic message if we haven't aquired a GPS lock
        if (now > GPSRetryCooldown) {
            Serial.println("Still waiting for GPS ...");
            GPSRetryCooldown += 5000;
        }
    }
}

void printTime()
{
    Serial.print(F("  Date/Time: "));
    if (gps.date.isValid()) {
        Serial.print(gps.date.month());
        Serial.print(F("/"));
        Serial.print(gps.date.day());
        Serial.print(F("/"));
        Serial.print(gps.date.year());
    } else {
        Serial.print(F("INVALID"));
    }

    Serial.print(F(" "));
    if (gps.time.isValid()) {
        if (gps.time.hour() < 10) Serial.print(F("0"));
        Serial.print(gps.time.hour());
        Serial.print(F(":"));
        if (gps.time.minute() < 10) Serial.print(F("0"));
        Serial.print(gps.time.minute());
        Serial.print(F(":"));
        if (gps.time.second() < 10) Serial.print(F("0"));
        Serial.print(gps.time.second());
        Serial.print(F("."));
        if (gps.time.centisecond() < 10) Serial.print(F("0"));
        Serial.print(gps.time.centisecond());
    } else {
        Serial.print(F("INVALID"));
    }

    Serial.println();
}

http_request_t request;
http_response_t response;

// Web variables
static const char* host = "davidm.id.au";
static const char* path = "add.py";
static const int port = 12345;

// Web client
HttpClient http;


// Headers can tell the webserver additional info. In this case
// we just say that we're willing to accept anything.
http_header_t headers[] = {
    { "Accept" , "*/*"},
    { NULL, NULL } // NOTE: Always terminate headers with NULL
};

void uploadLoc()
{
    char data[200] = {0};
    sprintf(data, "%s?lat=%lf&lng=%lf",path,gps.location.lat(),gps.location.lng());

    request.hostname = host;
    request.port = port;
    request.path = data;

    http.get(request, response, headers);
    Serial.print("Response status: ");
    Serial.println(  );

    Serial.print("HTTP Response Body: ");
    Serial.println(response.body);
}

void printLocation()
{
    Serial.print(F("  Location: "));
    Serial.print(gps.location.lat(), 6);
    Serial.print(F(","));
    Serial.print(gps.location.lng(), 6);
    Serial.println();
}
