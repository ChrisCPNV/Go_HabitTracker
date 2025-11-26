package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ChrisCPNV/Go_HabitTracker/internal/db"
	"github.com/gorilla/mux"
)

type Router struct {
	db *sql.DB
}

func NewRouter(database *sql.DB) http.Handler {
	r := &Router{db: database}

	m := mux.NewRouter()

	// ===================== TASK ROUTES =====================
	m.HandleFunc("/api/tasks", r.getAllTasks).Methods("GET")
	m.HandleFunc("/api/tasks/{id:[0-9]+}", r.getTaskByID).Methods("GET")
	m.HandleFunc("/api/tasks", r.createTask).Methods("POST")
	m.HandleFunc("/api/tasks/{id:[0-9]+}", r.updateTask).Methods("PUT")
	m.HandleFunc("/api/tasks/{id:[0-9]+}", r.deleteTask).Methods("DELETE")
	m.HandleFunc("/api/tasks/{id:[0-9]+}/complete", r.toggleTaskComplete).Methods("POST")

	// ===================== TAG ROUTES =====================
	m.HandleFunc("/api/tags", r.getAllTags).Methods("GET")
	m.HandleFunc("/api/tags", r.createTag).Methods("POST")
	m.HandleFunc("/api/tags/{id:[0-9]+}", r.deleteTag).Methods("DELETE")

	// ===================== STATIC FILES =====================
	fileServer := http.FileServer(http.Dir("./internal/frontend"))
	m.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fileServer))

	// Pages
	m.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		http.ServeFile(w, req, "internal/frontend/home.html")
	}).Methods("GET")

	m.HandleFunc("/tags", func(w http.ResponseWriter, req *http.Request) {
		http.ServeFile(w, req, "internal/frontend/tags.html")
	}).Methods("GET")

	m.HandleFunc("/tasks", func(w http.ResponseWriter, req *http.Request) {
		http.ServeFile(w, req, "internal/frontend/tasks.html")
	}).Methods("GET")

	return m
}

// ======================= TASK HANDLERS =======================

func (r *Router) getAllTasks(w http.ResponseWriter, req *http.Request) {
	tasks, err := db.GetAllTasks(r.db)
	if err != nil {
		http.Error(w, "Erreur lors de la récupération des tâches", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(tasks)
}

func (r *Router) getTaskByID(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		http.Error(w, "ID de tâche invalide", http.StatusBadRequest)
		return
	}

	task, err := db.GetTaskByID(r.db, id)
	if err != nil {
		http.Error(w, "Tâche non trouvée", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(task)
}

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

func (r *Router) updateTask(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
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

	json.NewEncoder(w).Encode(map[string]string{"message": "Tâche mise à jour avec succès"})
}

func (r *Router) deleteTask(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		http.Error(w, "ID de tâche invalide", http.StatusBadRequest)
		return
	}

	if err := db.DeleteTask(r.db, id); err != nil {
		http.Error(w, "Erreur lors de la suppression de la tâche", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Tâche supprimée avec succès"})
}

func (r *Router) toggleTaskComplete(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		http.Error(w, "ID de tâche invalide", http.StatusBadRequest)
		return
	}

	task, err := db.GetTaskByID(r.db, id)
	if err != nil {
		http.Error(w, "Tâche non trouvée", http.StatusNotFound)
		return
	}

	task.Completed = !task.Completed

	if err := db.UpdateTask(r.db, task); err != nil {
		http.Error(w, "Erreur lors de la mise à jour de la tâche", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// ======================= TAG HANDLERS =======================

func (r *Router) getAllTags(w http.ResponseWriter, req *http.Request) {
	tags, err := db.GetAllTags(r.db)
	if err != nil {
		http.Error(w, "Erreur lors de la récupération des tags", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(tags)
}

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

func (r *Router) deleteTag(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		http.Error(w, "ID de tag invalide", http.StatusBadRequest)
		return
	}

	if err := db.DeleteTag(r.db, id); err != nil {
		http.Error(w, "Erreur lors de la suppression du tag", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Tag supprimé avec succès"})
}
