import OpenAI from 'openai';
import { Pool } from 'pg';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface SummaryResult {
  clinicianSummary: string[];
  todoList: string[];
  patientText: string;
}

export async function generateSummary(soap: string): Promise<SummaryResult> {
  const prompt = `You are a medical assistant helping clinicians summarize SOAP notes.
Extract exactly three bullet points for clinicians, a to-do list, and rewrite the note in plain language for the patient.
Return JSON with keys: clinicianSummary (array of three strings), todoList (array of strings), patientText.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: soap }
    ],
    temperature: 0.2
  });

  const content = response.choices[0]?.message?.content || '{}';
  const data = JSON.parse(content);

  return {
    clinicianSummary: data.clinicianSummary || [],
    todoList: data.todoList || [],
    patientText: data.patientText || ''
  };
}

export async function saveSummary(patientId: string, result: SummaryResult): Promise<void> {
  await pool.query(
    `INSERT INTO summary (patient_id, clinician_summary, todo_list, patient_text) VALUES ($1,$2,$3,$4)`,
    [
      patientId,
      JSON.stringify(result.clinicianSummary),
      JSON.stringify(result.todoList),
      result.patientText
    ]
  );
}

export async function getSummaries(patientId: string) {
  const { rows } = await pool.query(
    `SELECT id, clinician_summary, todo_list, patient_text, created_at FROM summary WHERE patient_id = $1 ORDER BY created_at DESC`,
    [patientId]
  );

  return rows.map(row => ({
    id: row.id,
    clinicianSummary: JSON.parse(row.clinician_summary),
    todoList: JSON.parse(row.todo_list),
    patientText: row.patient_text,
    createdAt: row.created_at
  }));
}

