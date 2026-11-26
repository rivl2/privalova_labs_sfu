
import { useEffect, useRef, useState } from 'react';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

function Todo({ todo, toggleTaskCompleted, deleteTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(todo.name);

  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editFieldRef.current?.focus();
    } else if (wasEditing && !isEditing) {
      editButtonRef.current?.focus();
    }
  }, [wasEditing, isEditing]);

  function handleEditSubmit(event) {
    event.preventDefault();

    const trimmedName = newName.trim();

    if (!trimmedName) {
      return;
    }

    editTask(todo.id, trimmedName);
    setIsEditing(false);
  }

  function handleCancel() {
    setNewName(todo.name);
    setIsEditing(false);
  }

  const editingTemplate = (
    <form onSubmit={handleEditSubmit} className="edit-form">
      <label htmlFor={`edit-${todo.id}`}>
        Новое название задачи
      </label>

      <input
        id={`edit-${todo.id}`}
        type="text"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        className="todo-input"
        ref={editFieldRef}
        required
      />

      <div className="todo-actions">
        <button type="submit" className="save-button">
          Сохранить
        </button>

        <button
          type="button"
          className="cancel-button"
          onClick={handleCancel}
        >
          Отмена
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onChange={() => toggleTaskCompleted(todo.id)}
        />

        <label
          htmlFor={`todo-${todo.id}`}
          className={todo.completed ? 'completed' : ''}
        >
          {todo.name}
        </label>
      </div>

      <div className="todo-actions">
        <button
          type="button"
          className="edit-button"
          onClick={() => {
            setNewName(todo.name);
            setIsEditing(true);
          }}
          disabled={todo.completed}
          ref={editButtonRef}
          aria-label={`Изменить задачу: ${todo.name}`}
        >
          Изменить
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={() => deleteTask(todo.id)}
          aria-label={`Удалить задачу: ${todo.name}`}
        >
          Удалить
        </button>
      </div>
    </div>
  );

  return (
    <li className="todo-list-item">
      {isEditing ? editingTemplate : viewTemplate}
    </li>
  );
}

export default Todo;
