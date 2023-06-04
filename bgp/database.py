import sqlite3

connection = sqlite3.connect("cache.db")
connection.execute("CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, data TEXT)")
connection.close()