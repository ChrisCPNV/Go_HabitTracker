# **Go_HabitTracker**

A simple and efficient habit tracking application built with Go, featuring a REST API and SQLite database for managing tasks and tags.

## **Contributors**

- **Chris Brandt** (<chris.brandt@eduvaud.ch>)

## **Overview**

Go_HabitTracker is a full-stack habit tracker that allows users to:

- Create, read, update, and delete tasks (habits)
- Organize tasks with tags/categories
- Mark tasks as complete
- Track tasks visually with a calendar
- View tasks for a selected day alongside the calendar
- Edit tasks by double-clicking it, opening a shared modal
- Manage habit data persistently with SQLite

The application provides a REST API for backend management and a responsive frontend built with HTML, CSS, and JavaScript.

## **Technologies Used**

- **Language:** Go 1.21+
- **Database:** SQLite (via `modernc.org/sqlite`)
- **Architecture:** REST API with HTTP handlers
- **Frontend:** HTML, CSS, JavaScript
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
│       ├── home/  
│       │   ├── calendar.css      # Calendar-specific CSS
│       │   ├── calendar.js
│       │   └── home.html         # Homepage with calendar view 
│       ├── navbar/ 
│       │   ├── navbar.js
│       │   └── header.html
│       ├── tags/
│       │   ├── tags.css      # tags-specific CSS
│       │   ├── tags.js
│       │   └── tags.html         
│       ├── tasks/    
│       │   ├── tasks.css      # tasks-specific CSS
│       │   ├── tasks.js
│       │   └── tasks.html 
|       ├── modals/    
│       │   └── editTaskModal.html     # shared modals             
│       └── global.css         # global theme CSS      
├── go.mod                    
├── go.sum                    
├── README.md                 
└── journal.md                

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

2. **Build the application**

   ```bash
   go build -o GoHabitTracker.exe ./cmd/server
   ```

   In case the system cannot find the path specified:

   ```powershell
   set GOTMPDIR=C:\Users\<user>\Dev\Temp
   ```

   This may need to be adapted to the path you want.

   If server is still running you won't be able to build the application.

   ```powershell
   Stop-Process -Name server -Force -ErrorAction SilentlyContinue; Stop-Process -Name GoHabitTracker -Force -ErrorAction SilentlyContinue
   ```

3. **Run the application**

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
| POST | `/api/tasks/{id}/complete` | Toggle completion |

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
| GET | `/tasks` | Tasks management page |
| GET | `/tags` | Tags management page |

## **Frontend Features**

### **General**

- A navigation bar is shared by all pages and contains:
  - A switch to change from light theme to dark theme and vice versa
  - The name of the app and a small description
  - Buttons leading to each pages

### **Home Page**

#### **Calendar View**

- Visual monthly calendar displays all day
- Tasks wth a due date ar highlighted on the calendar
- Navigation arrows to move between months
- Clicking a day shows all tasks for that day in a sidebar
- Task names and optional description are displayed

#### **Task Sidebar**

- Shows tasks for the selected day
- Each task displays :
  - Name (bold)
  - Description (if present)
  - Tag (color-coded)
- Updates dynamically when the user selects a different day
- Tasks can be edited by double-clicking

### **Task Page**

- Shows all tasks created
- Each tasks display
  - The tag (if present)
  - The name
  - The description (if present)
  - The due date (if present)
- Filters to find tasks by their tags
- Tasks can be marked as completed, they become hidden
- Completed tasks can be shown with a checkbox
- A button to add tasks at the bottom

### **Tag Page**

- Shows all tags created
- The tags are given a color reflected by their appearance
- A button to delete each tag is present
- A bottom to add tags is at the bottom

## **Curl Usage Examples**

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
    "due_date": "2025-07-23",
    "completed": false
  }'
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

## **Configuration**

- Database file location: Default `Gohabit.db` in the working directory. Modify `cmd/server/main.go` to change.
- Server port: Default `8080`. Modify `cmd/server/main.go` to change.

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

- [x] Frontend UI (HTML/CSS/JavaScript)
- [x] Double-click to edit tasks
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
