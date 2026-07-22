CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    tvg_id TEXT,
    tvg_logo TEXT,
    group_title TEXT,
    country TEXT,
    language TEXT,
    stream_url TEXT,
    status INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    year INTEGER,
    description TEXT,
    poster TEXT,
    backdrop TEXT,
    genre TEXT,
    language TEXT,
    rating REAL,
    stream_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS series (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    poster TEXT,
    backdrop TEXT,
    genre TEXT,
    language TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id INTEGER,
    season INTEGER,
    episode INTEGER,
    title TEXT,
    stream_url TEXT,
    FOREIGN KEY(series_id) REFERENCES series(id)
);