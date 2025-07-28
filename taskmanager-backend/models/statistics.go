package models

type TaskStats struct {
	Total      int64 `json:"total"`
	InProgress int64 `json:"in_progress"`
	Done  int64 `json:"done"`
	Overdue    int64 `json:"overdue"`
	Todo    int64 `json:"todo"`
}
