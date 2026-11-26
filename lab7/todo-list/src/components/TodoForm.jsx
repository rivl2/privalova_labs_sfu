
import { useState } from 'react';

function TodoForm({ addTask }) {
  const [name, setName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    addTask(trimmedName);
    setName('');
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <label htmlFor="new-todo-input">
        Новая задача
      </label>

      <div className="form-row">
        <input
          type="text"
          id="new-todo-input"
          className="todo-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Что нужно сделать?"
          required
        />

        <button type="submit" className="add-button">
          Добавить
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
