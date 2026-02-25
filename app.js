const state = {
  tasks: [
    { id: crypto.randomUUID(), title: 'Przygotować plan dnia', done: false },
    { id: crypto.randomUUID(), title: '30 min treningu', done: true },
    { id: crypto.randomUUID(), title: 'Nauka angielskiego', done: false },
  ],
  query: '',
  filter: 'all',
};

const taskList = document.querySelector('#taskList');
const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const search = document.querySelector('#search');
const statusFilter = document.querySelector('#statusFilter');
const template = document.querySelector('#taskItemTemplate');

function getVisibleTasks() {
  return state.tasks.filter((task) => {
    const statusMatch =
      state.filter === 'all' ||
      (state.filter === 'done' && task.done) ||
      (state.filter === 'open' && !task.done);

    const queryMatch = task.title.toLowerCase().includes(state.query.toLowerCase());

    return statusMatch && queryMatch;
  });
}

function render() {
  taskList.innerHTML = '';
  const visibleTasks = getVisibleTasks();

  if (!visibleTasks.length) {
    const empty = document.createElement('li');
    empty.className = 'panel empty';
    empty.textContent = 'Brak zadań do wyświetlenia.';
    taskList.append(empty);
    return;
  }

  for (const task of visibleTasks) {
    const fragment = template.content.cloneNode(true);
    const item = fragment.querySelector('.task-item');
    const checkbox = fragment.querySelector('.toggle');
    const title = fragment.querySelector('.title');
    const deleteButton = fragment.querySelector('.delete');

    checkbox.checked = task.done;
    title.textContent = task.title;
    title.classList.toggle('done', task.done);

    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      render();
    });

    deleteButton.addEventListener('click', () => {
      state.tasks = state.tasks.filter((entry) => entry.id !== task.id);
      render();
    });

    item.dataset.id = task.id;
    taskList.append(fragment);
  }
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();
  if (!value) {
    return;
  }

  state.tasks.unshift({
    id: crypto.randomUUID(),
    title: value,
    done: false,
  });
  taskInput.value = '';
  render();
});

search.addEventListener('input', () => {
  state.query = search.value;
  render();
});

statusFilter.addEventListener('change', () => {
  state.filter = statusFilter.value;
  render();
});

render();
