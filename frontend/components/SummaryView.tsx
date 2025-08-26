import React, { useState } from 'react';

interface SummaryViewProps {
  initialSummary: string[];
  initialTodo: string[];
  patientText: string;
  onChange?: (summary: string[], todo: string[], patientText: string) => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({
  initialSummary,
  initialTodo,
  patientText: initialPatientText,
  onChange
}) => {
  const [summary, setSummary] = useState<string[]>(initialSummary);
  const [todo, setTodo] = useState<string[]>(initialTodo);
  const [patientText, setPatientText] = useState<string>(initialPatientText);

  const updateSummary = (index: number, value: string) => {
    const next = [...summary];
    next[index] = value;
    setSummary(next);
    onChange?.(next, todo, patientText);
  };

  const updateTodo = (index: number, value: string) => {
    const next = [...todo];
    next[index] = value;
    setTodo(next);
    onChange?.(summary, next, patientText);
  };

  const updatePatientText = (value: string) => {
    setPatientText(value);
    onChange?.(summary, todo, value);
  };

  const addSummary = () => {
    const next = [...summary, ''];
    setSummary(next);
  };

  const addTodo = () => {
    const next = [...todo, ''];
    setTodo(next);
  };

  return (
    <div>
      <h2>Summary</h2>
      <ul>
        {summary.map((item, i) => (
          <li key={i}>
            <input
              type="text"
              value={item}
              onChange={e => updateSummary(i, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <button onClick={addSummary}>Add Summary Item</button>

      <h2>To-Do</h2>
      <ul>
        {todo.map((item, i) => (
          <li key={i}>
            <input
              type="text"
              value={item}
              onChange={e => updateTodo(i, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <button onClick={addTodo}>Add To-Do Item</button>

      <h2>Patient Explanation</h2>
      <textarea
        value={patientText}
        onChange={e => updatePatientText(e.target.value)}
      />
    </div>
  );
};

export default SummaryView;

