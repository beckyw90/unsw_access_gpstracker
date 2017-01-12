#!/usr/bin/python3
import sys, codecs, cgi, cgitb, sqlite3
web_cgi = codecs.getwriter('utf-8')(sys.stdout.buffer)

HEADER = 'Content-Type:application/json;charset=utf-8\n'

def query(t=0):
    conn = sqlite3.connect('activity.sqlite3')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS log (_id INTEGER PRIMARY KEY, lat REAL, lng REAL, timestamp INTEGER)')
    conn.commit()
    c.execute('SELECT lat, lng, timestamp FROM log WHERE timestamp > ?', (t, ))
    json_items = []
    for row in c.fetchall():
        json_items.append('{{"lat":{0},"lng":{1},"timestamp":{2}}}'.format(row[0], row[1], row[2]))
    print('{"locations":[', file=web_cgi)
    print(','.join(json_items), file=web_cgi)
    print(']}')
    conn.close()

def main():
    print(HEADER, file=web_cgi)
    cgitb.enable()
    forms = cgi.FieldStorage()

    prev_time = forms.getvalue('t')
    if prev_time:
        query(int(float(prev_time)))
    else:
        query()

if __name__ == '__main__':
    main()