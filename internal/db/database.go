package db

import (
	"database/sql"
	"os"
	"time"

	_ "modernc.org/sqlite"
)

// Task represents a habit/task
type Task struct {
	ID          int64   `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	TagID       *int64  `json:"tag_id,omitempty"`
	DueDate     *string `json:"due_date,omitempty"`
	Completed   bool    `json:"completed"`
	CreatedAt   string  `json:"created_at"`
}

// Tag represents a task tag/category
type Tag struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

// OpenDatabase opens or creates the SQLite database
func OpenDatabase(dbPath string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	// Create tables from schema
	if err := createTables(db); err != nil {
		return nil, err
	}

	return db, nil
}

// createTables creates the necessary tables if they don't exist by reading schema.sql
func createTables(db *sql.DB) error {
	schemaBytes, err := os.ReadFile("internal/db/schema.sql")
	if err != nil {
		return err
	}

	_, err = db.Exec(string(schemaBytes))
	return err
}

// ===== TASK FUNCTIONS =====

func GetAllTasks(db *sql.DB) ([]Task, error) {
	rows, err := db.Query("SELECT id, name, description, tag_id, due_date, completed, created_at FROM tasks")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Name, &task.Description, &task.TagID, &task.DueDate, &task.Completed, &task.CreatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}

	return tasks, rows.Err()
}

func GetTaskByID(db *sql.DB, id int64) (Task, error) {
	var task Task
	row := db.QueryRow("SELECT id, name, description, tag_id, due_date, completed, created_at FROM tasks WHERE id = ?", id)

	err := row.Scan(&task.ID, &task.Name, &task.Description, &task.TagID, &task.DueDate, &task.Completed, &task.CreatedAt)
	if err != nil {
		return Task{}, err
	}

	return task, nil
}

func CreateTask(db *sql.DB, task Task) (int64, error) {
	result, err := db.Exec(
		"INSERT INTO tasks (name, description, tag_id, due_date, completed, created_at) VALUES (?, ?, ?, ?, ?, ?)",
		task.Name,
		task.Description,
		task.TagID,
		task.DueDate,
		task.Completed,
		time.Now().Format(time.RFC3339),
	)
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func UpdateTask(db *sql.DB, task Task) error {
	_, err := db.Exec(
		"UPDATE tasks SET name = ?, description = ?, tag_id = ?, due_date = ?, completed = ? WHERE id = ?",
		task.Name,
		task.Description,
		task.TagID,
		task.DueDate,
		task.Completed,
		task.ID,
	)
	return err
}

func DeleteTask(db *sql.DB, id int64) error {
	_, err := db.Exec("DELETE FROM tasks WHERE id = ?", id)
	return err
}

func MarkTaskComplete(db *sql.DB, id int64) error {
	_, err := db.Exec("UPDATE tasks SET completed = 1 WHERE id = ?", id)
	return err
}

// ===== TAG FUNCTIONS =====

func GetAllTags(db *sql.DB) ([]Tag, error) {
	rows, err := db.Query("SELECT id, name FROM tags")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []Tag
	for rows.Next() {
		var tag Tag
		if err := rows.Scan(&tag.ID, &tag.Name); err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}

	return tags, rows.Err()
}

func CreateTag(db *sql.DB, tag Tag) (int64, error) {
	result, err := db.Exec("INSERT INTO tags (name) VALUES (?)", tag.Name)
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func DeleteTag(db *sql.DB, id int64) error {
	_, err := db.Exec("DELETE FROM tags WHERE id = ?", id)
	return err
}
