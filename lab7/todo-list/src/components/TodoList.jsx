
import Todo from './Todo';

function TodoList({
  tasks,
  toggleTaskCompleted,
  deleteTask,
  editTask
}) {
  return (
    <ul className="todo-list">
      {tasks.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          toggleTaskCompleted={toggleTaskCompleted}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      ))}
    </ul>
  );
}

export default TodoList;
