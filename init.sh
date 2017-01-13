chmod o+rw .
#chmod a+rw *
python3.5 query.py > /dev/null
chmod a+rw activity.sqlite3
chmod -R a+rX css script images
chmod 755 *.py
