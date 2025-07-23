# Task Manager App

A simple fullstack Task Management web app built with **Go (Golang)** for the backend and **Next.js** for the frontend.

## Requirements

### Backend
* Go 1.21+
* PostgreSQL

### Frontend
* Node.js 18+
* npm (or yarn)

## Getting Started

### 1. Clone the Repository

```bash
[git clone https://github.com/your-username/taskmanager-project.git](https://github.com/bintangsiahaan/taskmanager-project.git)
cd taskmanager-project
```

### 2. Setup the Backend

```bash
cd taskmanager-backend
```

#### Create PostgreSQL Database
Access `psql` and create the user and database:

```sql
-- Access psql
psql -U postgres

-- Create user & database
CREATE USER taskmanager WITH PASSWORD 'taskmanager';
CREATE DATABASE taskmanager OWNER taskmanager;

-- Optional: Create schema
\c taskmanager
CREATE SCHEMA taskschema;
```

#### Run the Backend

```bash
go run main.go
```

Backend will run at: `http://localhost:8080`

### 3. Setup the Frontend

```bash
cd ../taskmanager-frontend
```

#### Install Dependencies

```bash
npm install
```

#### Run the Frontend

```bash
npm run dev
```

Frontend will run at: `http://localhost:3000`

## Features

* Register & Login (JWT Auth)
* Create / Edit / Delete Task
* Assign Task to User
* View All Tasks
* Responsive UI
