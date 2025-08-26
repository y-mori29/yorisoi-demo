CREATE TABLE IF NOT EXISTS summary (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(255) NOT NULL,
  clinician_summary TEXT NOT NULL,
  todo_list TEXT NOT NULL,
  patient_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
