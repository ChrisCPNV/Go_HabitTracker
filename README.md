# **Go_HabitTracker**

A simple and efficient habit tracking application built with Go, featuring a REST API and SQLite database for managing tasks and tags.

## **Contributors**

- **Chris Brandt** (<chris.brandt@eduvaud.ch>)

## **Overview**

Go_HabitTracker is a backend REST API application that allows users to:

- Create, read, update, and delete tasks (habits)
- Organize tasks with tags/categories
- Mark tasks as complete
- Manage habit data persistently with SQLite

The application provides a clean REST API interface for task management and is built entirely in Go for performance and simplicity.

## **Technologies Used**

- **Language:** Go 1.21+
- **Database:** SQLite (via `modernc.org/sqlite`)
- **Architecture:** REST API with HTTP handlers
- **Database Driver:** Pure Go SQLite implementation (no CGO required)

## **Project Structure**

```text
Go_HabitTracker/
├── cmd/
│   └── server/
│       └── main.go           # Application entry point
├── internal/
│   ├── db/
│   │   ├── database.go       # Database logic & CRUD operations
│   │   └── schema.sql        # Database schema
│   ├── routes/
│   │   └── router.go         # Route definitions & handlers
│   ├── services/             
│   └── frontend/             
│       ├── app.js            # JS for the html page
│       ├── home.html         # The html for the page that the user will see
│       └── light.css         # Css file for the light style of the page
├── go.mod                    # Go module definition
├── go.sum                    # Go module checksums
├── README.md                 # This file
└── journal.md                # Development journal
```

## **How to Setup?**

### **Prerequisites**

- Go 1.21 or higher
- Git (for version control)

### **Dependencies**

The project uses the following Go packages:

```bash
go get modernc.org/sqlite  # Pure Go SQLite driver
```

All dependencies are defined in `go.mod` and can be installed with:

```bash
go mod download
```

### **Installation Steps**

1. **Clone the repository**

   ```bash
   git clone https://github.com/ChrisCPNV/Go_HabitTracker.git
   cd Go_HabitTracker
   ```

2. **Download dependencies**

   ```bash
   go mod download
   ```

3. **Build the application**

   ```bash
   go build -o GoHabitTracker.exe ./cmd/server
   ```

   If server is still running you won't be able to build the application.

   ```powershell
   Stop-Process -Name server -Force -ErrorAction SilentlyContinue; Stop-Process -Name GoHabitTracker -Force -ErrorAction SilentlyContinue
   ```

4. **Run the application**

   ```powershell
   # Option 1: Run in background (Windows)
   start-process -FilePath .\GoHabitTracker.exe -NoNewWindow
   
   # Option 2: Run in foreground
   .\GoHabitTracker.exe
   ```

The server will start on `http://localhost:8080`

## **API Endpoints**

### **Tasks**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/{id}` | Get task by ID |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

### **Tags**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | Get all tags |
| POST | `/api/tags` | Create a new tag |
| DELETE | `/api/tags/{id}` | Delete a tag |

### **Other**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Homepage |

## **Usage Examples**

### **Create a Tag**

```bash
curl -X POST http://localhost:8080/api/tags \
  -H "Content-Type: application/json" \
  -d '{"name": "Learning"}'
```

### **Create a Task**

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Learn Go",
    "description": "Complete Go fundamentals course",
    "tag_id": 1,
    "due_date": "23.07.2025",
    "completed": false
  }'
```

### **Get All Tasks**

```bash
curl http://localhost:8080/api/tasks
```

### **Get All Tags**

```bash
curl http://localhost:8080/api/tags
```

## **Database Schema**

### **Tasks Table**

```sql
CREATE TABLE tasks (
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
```

### **Tags Table**

```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
```

## **Configuration & Customization**

### **Database Location**

The database file is created as `GoHabit.db` in the working directory. To change the location, modify the path in `cmd/server/main.go`:

```go
database, err := db.OpenDatabase("path/to/your/database.db")
```

### **Server Port**

To change the server port from 8080, edit `cmd/server/main.go`:

```go
http.ListenAndServe(":YOUR_PORT", router)
```

### **Adding New Endpoints**

1. Add handler functions in `internal/routes/router.go`
2. Register the route in the `NewRouter()` function
3. Add corresponding database functions in `internal/db/database.go` if needed

## **Development**

### **Running Tests**

```bash
go test ./internal/db -v
```

### **Building for Different Platforms**

```bash
# Windows
GOOS=windows GOARCH=amd64 go build -o GoHabitTracker.exe ./cmd/server

# Linux
GOOS=linux GOARCH=amd64 go build -o GoHabitTracker ./cmd/server

# macOS
GOOS=darwin GOARCH=amd64 go build -o GoHabitTracker ./cmd/server
```

## **Future Enhancements**

- [ ] Frontend UI (HTML/CSS/JavaScript)
- [ ] User authentication
- [ ] Habit statistics and reports
- [ ] Recurring tasks/habits
- [ ] Notifications/reminders
- [ ] Database migrations
- [ ] Unit and integration tests

## **Contacts**

- **Developer:** Chris Brandt
- **Email:** <chris.brandt@eduvaud.ch>

## **License**

This project is part of an individual project for educational purposes.
