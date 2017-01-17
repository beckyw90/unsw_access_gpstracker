#!/usr/bin/env python3.5
# Remove all GPS coordinates


import sys, codecs, cgi, cgitb, sqlite3, datetime
web_cgi = codecs.getwriter('utf-8')(sys.stdout.buffer)

HEADER = 'Content-Type:text/html;charset=utf-8\n\nCleared'

def main():
    conn = sqlite3.connect('activity.sqlite3')
    c = conn.cursor()
    c.execute('DELETE FROM log;')
    conn.commit()
    c.close()
    conn.close()
    print(HEADER, file=web_cgi)


if __name__ == '__main__':
    main()