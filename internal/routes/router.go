package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ChrisCPNV/Go_HabitTracker/internal/db"
)

type Router struct {
	db *sql.DB
}

func NewRouter(database *sql.DB) http.Handler {
	r := &Router{db: database}

	mux := http.NewServeMux()

	// Tasks routes
	mux.HandleFunc("GET /api/tasks", r.getAllTasks)
	mux.HandleFunc("GET /api/tasks/{id}", r.getTaskByID)
	mux.HandleFunc("POST /api/tasks", r.createTask)
	mux.HandleFunc("PUT /api/tasks/{id}", r.updateTask)
	mux.HandleFunc("DELETE /api/tasks/{id}", r.deleteTask)

	// Tags routes
	mux.HandleFunc("GET /api/tags", r.getAllTags)
	mux.HandleFunc("POST /api/tags", r.createTag)
	mux.HandleFunc("DELETE /api/tags/{id}", r.deleteTag)

	// Serve static files (CSS, JS, HTML)
	fileServer := http.FileServer(http.Dir("./internal/frontend"))
	mux.Handle("GET /static/", http.StripPrefix("/static/", fileServer))

	// Serve home.html
	mux.HandleFunc("GET /", func(w http.ResponseWriter, req *http.Request) {
		http.ServeFile(w, req, "internal/frontend/home.html")
	})

	return mux
}

// getAllTasks handles fetching all tasks
func (r *Router) getAllTasks(w http.ResponseWriter, req *http.Request) {

	tasks, err := db.GetAllTasks(r.db)
	if err != nil {
		http.Error(w, "Erreur lors de la récupération des tâches", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tasks)
}

// getTaskByID handles fetching a task by its ID
func (r *Router) getTaskByID(w http.ResponseWriter, req *http.Request) {

	id, err := strconv.ParseInt(req.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "ID de tâche invalide", http.StatusBadRequest)
		return
	}

	task, err := db.GetTaskByID(r.db, id)
	if err != nil {
		http.Error(w, "Tâche non trouvée", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(task)
}

// createTask handles the creation of a new task
func (r *Router) createTask(w http.ResponseWriter, req *http.Request) {

	var task db.Task
	if err := json.NewDecoder(req.Body).Decode(&task); err != nil {
		http.Error(w, "Données de tâche invalides", http.StatusBadRequest)
		return
	}

	id, err := db.CreateTask(r.db, task)
	if err != nil {
		http.Error(w, "Erreur lors de la création de la tâche", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int64{"id": id})
}

// updateTask handles updating an existing task
func (r *Router) updateTask(w http.ResponseWriter, req *http.Request) {

	id, err := strconv.ParseInt(req.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "ID de tâche invalide", http.StatusBadRequest)
		return
	}

	var task db.Task
	if err := json.NewDecoder(req.Body).Decode(&task); err != nil {
		http.Error(w, "Données de tâche invalides", http.StatusBadRequest)
		return
	}

	task.ID = id
	if err := db.UpdateTask(r.db, task); err != nil {
		http.Error(w, "Erreur lors de la mise à jour de la tâche", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Tâche mise à jour avec succès"})
}

// deleteTask handles deleting a task by its ID
func (r *Router) deleteTask(w http.ResponseWriter, req *http.Request) {

	id, err := strconv.ParseInt(req.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "ID de tâche invalide", http.StatusBadRequest)
		return
	}

	if err := db.DeleteTask(r.db, id); err != nil {
		http.Error(w, "Erreur lors de la suppression de la tâche", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Tâche supprimée avec succès"})
}

// getAllTags handles fetching all tags
func (r *Router) getAllTags(w http.ResponseWriter, req *http.Request) {

	tags, err := db.GetAllTags(r.db)
	if err != nil {
		http.Error(w, "Erreur lors de la récupération des tags", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tags)
}

// createTag handles the creation of a new tag
func (r *Router) createTag(w http.ResponseWriter, req *http.Request) {

	var tag db.Tag
	if err := json.NewDecoder(req.Body).Decode(&tag); err != nil {
		http.Error(w, "Données de tag invalides", http.StatusBadRequest)
		return
	}

	id, err := db.CreateTag(r.db, tag)
	if err != nil {
		http.Error(w, "Erreur lors de la création du tag", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int64{"id": id})
}

// deleteTag handles deleting a tag by its ID
func (r *Router) deleteTag(w http.ResponseWriter, req *http.Request) {

	id, err := strconv.ParseInt(req.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "ID de tag invalide", http.StatusBadRequest)
		return
	}

	if err := db.DeleteTag(r.db, id); err != nil {
		http.Error(w, "Erreur lors de la suppression du tag", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Tag supprimé avec succès"})
}
