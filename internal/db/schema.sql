CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#888888'
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    tag_id INTEGER,
    due_date TEXT,
    completed BOOLEAN NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,

    FOREIGN KEY (tag_id) REFERENCES tags(id),

    UNIQUE(name, due_date)
);