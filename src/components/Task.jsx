import React, { useState, useEffect } from 'react';

function Task() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === '') return alert('Task cannot be empty');
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task.trim(),
        completed: false,
        createdAt: new Date(),
      },
    ]);
    setTask('');
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const toggleComplete = (id) =>
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  const markAllComplete = () =>
    setTasks(tasks.map((t) => ({ ...t, completed: true })));

  const clearCompleted = () =>
    setTasks(tasks.filter((t) => !t.completed));

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const submitEdit = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editingText } : t
      )
    );
    setEditingId(null);
    setEditingText('');
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  const sortedTasks = filteredTasks.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10 text-gray-800 dark:text-white transition">
      <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 dark:text-blue-400 mb-6">
          📝 To-Do List
        </h1>

        {/* Task Input */}
        <div className="flex gap-2 mb-4">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Add
          </button>
        </div>

        {/* Extra Controls */}
        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          />
          <div className="flex gap-2 text-sm">
            <button
              onClick={markAllComplete}
              className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              Mark All Complete
            </button>
            <button
              onClick={clearCompleted}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              Clear Completed
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-4 text-sm font-medium">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full transition ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
              }`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="space-y-3">
          {sortedTasks.length === 0 && (
            <li className="text-center text-gray-400 italic">
              No tasks found.
            </li>
          )}

          {sortedTasks.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow transition"
            >
              <div className="flex items-center gap-3 w-full">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(t.id)}
                  className="accent-blue-600 w-5 h-5"
                />
                {editingId === t.id ? (
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => submitEdit(t.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitEdit(t.id);
                    }}
                    className="flex-grow bg-transparent border-b border-blue-400 outline-none"
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => startEdit(t.id, t.text)}
                    className={`flex-grow cursor-pointer ${
                      t.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {t.text}
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteTask(t.id)}
                className="text-red-500 hover:text-red-700 text-lg transition"
              >
                cancel
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Task;
