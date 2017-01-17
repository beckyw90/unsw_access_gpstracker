#!/usr/bin/env python3.5
# Add gps coordinates to website
# Usage: add.py?lat=-324.2343&lng=133.324324
import sys, codecs, cgi, cgitb, sqlite3, datetime
web_cgi = codecs.getwriter('utf-8')(sys.stdout.buffer)

HEADER = 'Content-Type:text/html;charset=utf-8'
HEADER_ERR = 'Status: 400 Bad Request\n\nUsage: add.py?lat=-324.2343&lng=133.324324'

def insert(lat, lng):
    timestamp = int(datetime.datetime.utcnow().timestamp())
    try:
        conn = sqlite3.connect('activity.sqlite3')
        c = conn.cursor()
        c.execute('CREATE TABLE IF NOT EXISTS log (_id INTEGER PRIMARY KEY, lat REAL, lng REAL, timestamp INTEGER)')
        conn.commit()
        c.execute('INSERT INTO log (lat, lng, timestamp) VALUES (?, ?, ?)', (lat, lng, timestamp))
        conn.commit()
        print("\n\nAdded.", file=web_cgi)
    except Exception as e:
        raise
    finally:
        c.close()
        conn.close()
    

def main():
    print(HEADER, file=web_cgi)
    cgitb.enable()
    try:
        forms = cgi.FieldStorage()
        lat = float(forms.getvalue('lat'))
        lng = float(forms.getvalue('lng'))
        if lat == 0 and lng == 0:
            print("Status: 400 Bad Request\n\nInvalid coordinates", file=web_cgi)
            pass
        else:
            insert(lat, lng)
    except Exception as e:
        print(HEADER_ERR, file=web_cgi)


if __name__ == '__main__':
    if len(sys.argv) == 3:
        lat = float(sys.argv[1])
        lng = float(sys.argv[2])
        insert(lat, lng)
    else:
        main()
