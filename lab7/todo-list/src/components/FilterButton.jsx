
function FilterButton({ name, isPressed, setFilter }) {
  return (
    <button
      type="button"
      className={`filter-button ${isPressed ? 'active' : ''}`}
      aria-pressed={isPressed}
      onClick={() => setFilter(name)}
    >
      {name === 'All'
        ? 'Все'
        : name === 'Active'
          ? 'Активные'
          : 'Выполненные'}
    </button>
  );
}

export default FilterButton;
