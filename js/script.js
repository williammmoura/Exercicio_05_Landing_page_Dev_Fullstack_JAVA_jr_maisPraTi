// Função para carregar as tarefas salvas no localStorage
function loadTasks() {
    let savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
}

// Função para salvar as tarefas no localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para exibir tarefas na página
function displayTasks(tasksToDisplay = null) {
    const tasks = tasksToDisplay || loadTasks();
    const taskList = document.querySelector('#task-list tbody');

    if (!taskList) {
        console.error("Element '#task-list tbody' not found on page.");
        return;
    }

    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.date}</td>
            <td>${task.type}</td>
            <td>${task.description}</td>
            <td>
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="complete-btn" onclick="toggleCompleteTask(${index})">
                    ${task.completed ? 'Incomplete' : 'Full'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </td>
        `;
        if (task.completed) {
            row.classList.add('completed');
        }
        taskList.appendChild(row);
    });
}

// Função para filtrar tarefas com base no tipo selecionado
function applyFilters() {
    const filterType = document.getElementById('filter-type').value;
    const tasks = loadTasks();
    const filteredTasks = filterType ? tasks.filter(task => task.type === filterType) : tasks;

    displayTasks(filteredTasks);

    if (filteredTasks.length === 0) {
        alert('No tasks found for this type.');
    }
}

// Função para adicionar uma nova tarefa
function addTask(event) {
    event.preventDefault();

    const year = document.getElementById('select-year').value;
    const month = document.getElementById('select-month').value;
    const day = document.getElementById('input-day').value;
    const type = document.getElementById('select-type').value;
    const description = document.getElementById('input-description').value;

    if (!year || !month || !day || !type || !description) {
        alert('Please fill in all fields!');
        return;
    }

    const task = {
        date: `${day}-${month}-${year}`,
        type,
        description,
        completed: false,
    };

    const tasks = loadTasks();
    tasks.push(task);
    saveTasks(tasks);

    alert("Task saved successfully!");
    resetForm();
}

// Função para editar uma tarefa
function editTask(index) {
    localStorage.setItem('taskIndex', index); // Salva o índice no localStorage
    window.location.href = 'index.html'; // Redireciona para a página de edição
}

// Função para atualizar uma tarefa
function updateTask(event, index) {
    event.preventDefault();

    const year = document.getElementById('select-year').value;
    const month = document.getElementById('select-month').value;
    const day = document.getElementById('input-day').value;
    const type = document.getElementById('select-type').value;
    const description = document.getElementById('input-description').value;

    if (!year || !month || !day || !type || !description) {
        alert('Please fill in all fields!');
        return;
    }

    const tasks = loadTasks();
    tasks[index] = {
        date: `${day}-${month}-${year}`,
        type,
        description,
        completed: tasks[index].completed,
    };

    saveTasks(tasks);

    alert('Task updated successfully!');
    localStorage.removeItem('taskIndex'); // Remove o índice após a edição
    window.location.href = 'management.html'; // Retorna à página de gerenciamento
}

// Função para alternar o status de conclusão de uma tarefa
function toggleCompleteTask(index) {
    const tasks = loadTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    displayTasks();
}

// Função para excluir uma tarefa
function deleteTask(index) {
    const tasks = loadTasks();
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayTasks();
    alert("Task deleted successfully!");
}

// Função para resetar o formulário
function resetForm() {
    document.getElementById('select-year').value = '';
    document.getElementById('select-month').value = '';
    document.getElementById('input-day').value = '';
    document.getElementById('select-type').value = '';
    document.getElementById('input-description').value = '';
}

// Evento para carregar a página corretamente com base no contexto
document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.querySelector('#task-list');
    const taskForm = document.getElementById('task-form');

    if (taskList) {
        displayTasks(); // Gerencia a exibição no "management.html"
    }

    if (taskForm) {
        const saveButton = document.getElementById('saveBtn');
        const taskIndex = localStorage.getItem('taskIndex');

        if (taskIndex !== null) {
            const tasks = loadTasks();
            const task = tasks[taskIndex];

            document.getElementById('select-year').value = task.date.split('-')[2];
            document.getElementById('select-month').value = task.date.split('-')[1];
            document.getElementById('input-day').value = task.date.split('-')[0];
            document.getElementById('select-type').value = task.type;
            document.getElementById('input-description').value = task.description;

            saveButton.textContent = "Update";
            saveButton.removeEventListener('click', addTask);
            saveButton.addEventListener('click', function (event) {
                updateTask(event, taskIndex);
            });
        } else {
            saveButton.addEventListener('click', addTask);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const applyFiltersButton = document.getElementById('apply-filters');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyFilters);
    }
});
