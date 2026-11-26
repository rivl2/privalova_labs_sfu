
import { useState, useEffect, useRef } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterButton from './components/FilterButton';
import './App.css';

// Сохраняем предыдущее значение
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

// Функции фильтрации задач
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App() {
  // Загружаем задачи из localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('todo-tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
      return [];
    }
  });

  const [filter, setFilter] = useState('All');

  // Ссылка на заголовок списка
  const listHeadingRef = useRef(null);

  // Получаем предыдущее количество задач
  const prevTaskLength = usePrevious(tasks.length);

  // Переносим фокус на заголовок после удаления задачи
  useEffect(() => {
    if (
      prevTaskLength !== undefined &&
      tasks.length < prevTaskLength
    ) {
      listHeadingRef.current?.focus();
    }
  }, [tasks.length, prevTaskLength]);

  // Сохраняем задачи после каждого изменения
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Добавление новой задачи
  function addTask(name) {
    const newTask = {
      id: crypto.randomUUID(),
      name: name,
      completed: false
    };

    setTasks((previousTasks) => [
      ...previousTasks,
      newTask
    ]);
  }

  // Изменение статуса выполнения задачи
  function toggleTaskCompleted(id) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // Удаление задачи
  function deleteTask(id) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  // Редактирование задачи
  function editTask(id, newName) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, name: newName }
          : task
      )
    );
  }

  // Фильтрация задач
  const filteredTasks = tasks.filter(FILTER_MAP[filter]);

  // Правильное склонение слова «задача»
  function taskNoun(number) {
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'задач';
    }

    switch (number % 10) {
      case 1:
        return 'задача';
      case 2:
      case 3:
      case 4:
        return 'задачи';
      default:
        return 'задач';
    }
  }

  // Создание кнопок фильтрации
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={filter === name}
      setFilter={setFilter}
    />
  ));

  return (
    <main className="app">
      <header className="app-header">
        <div className="header-icon" aria-hidden="true">
          ✓
        </div>

        <h1>Мои задачи</h1>

        <p>Планируй, выполняй, достигай!</p>
      </header>

      <section
        className="todo-container"
        aria-label="Список задач"
      >
        <TodoForm addTask={addTask} />

        <div className="filter-section">
          <h2
            id="list-heading"
            tabIndex={-1}
            ref={listHeadingRef}
          >
            Мои дела
          </h2>

          <div
            className="filter-buttons"
            aria-label="Фильтры задач"
          >
            {filterList}
          </div>
        </div>

        <TodoList
          tasks={filteredTasks}
          toggleTaskCompleted={toggleTaskCompleted}
          deleteTask={deleteTask}
          editTask={editTask}
        />

        {filteredTasks.length === 0 && (
          <div className="empty-state" role="status">
            <div className="empty-icon" aria-hidden="true">
              ✦
            </div>

            <p>
              {tasks.length === 0
                ? 'Пока нет задач. Добавь свою первую!'
                : 'В этой категории пока нет задач.'}
            </p>
          </div>
        )}

        <footer className="todo-footer">
          <span>
            Осталось:{' '}
            {tasks.filter((task) => !task.completed).length}{' '}
            {taskNoun(
              tasks.filter((task) => !task.completed).length
            )}
          </span>

          <span>
            Выполнено:{' '}
            {tasks.filter((task) => task.completed).length}
          </span>
        </footer>
      </section>

      <p className="app-note">
        Маленькие шаги ведут к большим результатам
      </p>
    </main>
  );
}

export default App;
