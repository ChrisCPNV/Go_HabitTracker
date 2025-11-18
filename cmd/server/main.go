package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ChrisCPNV/Go_HabitTracker/internal/db"
	"github.com/ChrisCPNV/Go_HabitTracker/internal/routes"
)

func main() {
	// Open database connection
	database, err := db.OpenDatabase("GoHabit.db")

	if err != nil {
		log.Fatalf("Impossible d'ouvrir la base de données : %v", err)
	}
	defer database.Close()

	// Set up routes
	router := routes.NewRouter(database)

	// Start the server
	fmt.Println("Serveur lancé sur http://localhost:8080")
	err = http.ListenAndServe(":8080", router)
	if err != nil {
		log.Fatalf("Erreur du serveur : %v", err)
	}
}
