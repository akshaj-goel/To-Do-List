//JavaScript Code for the To-Do List//

const userTaskInput = document.getElementById('userTaskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const alerter = document.getElementById('alerter');

let todoStorage = [];
try {
    const storedData = localStorage.getItem('todo-list');
    if (storedData) {
        todoStorage = JSON.parse(storedData) || [];
    }
} catch (error) {
    console.error('Error parsing todo-list from localStorage:', error);
    todoStorage = [];
}

const getForm = (event) => {
    event.preventDefault();
    const formResult = userTaskInput.value.trim();

    if (!formResult) {
        alerter.textContent = 'Please enter a task';
    } else if (todoStorage.includes(formResult)) {
        alerter.textContent = 'This task already exists in the to-do list';
        userTaskInput.value = '';
    } else {
        createTaskItem(formResult);
        userTaskInput.value = '';
        alerter.textContent = 'Task entered successfully';
    }
};

const form = document.getElementById('taskForm');
form.addEventListener('submit', getForm);

function createTaskItem(formResult) {
    const taskElement = document.createElement('li');
    taskList.appendChild(taskElement);

    const taskText = document.createElement('p');
    taskElement.appendChild(taskText);
    taskText.style.maxWidth = '75%';
    taskText.textContent = formResult;

    todoStorage.push(formResult);
    localStorage.setItem('todo-list', JSON.stringify(todoStorage));

    const editButton = document.createElement('button');
    editButton.classList.add('editButton');
    editButton.textContent = 'Edit';
    taskElement.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.textContent = 'Delete';
    taskElement.appendChild(deleteButton);

    editButton.addEventListener('click', () => {
        if (taskElement.querySelector('input')) return;

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = taskElement.firstChild.textContent;
        inputField.style.width = '78%';
        inputField.style.backgroundColor = 'white';
        inputField.style.textAlign = 'left';

        taskElement.firstChild.textContent = '';
        taskElement.insertBefore(inputField, editButton);
        editButton.textContent = 'Save';

        const inputFieldKey = `task-li-${todoStorage.length - 1}-input-field-styles`;
        saveInputFieldStyles(inputField, inputFieldKey);

        editButton.addEventListener('click', () => {
            const newTaskText = inputField.value.trim();
            if (newTaskText) {
                taskElement.firstChild.textContent = newTaskText;
                taskElement.removeChild(inputField);
                editButton.textContent = 'Edit';

                const index = todoStorage.indexOf(formResult);
                if (index > -1) {
                    todoStorage[index] = newTaskText;
                    localStorage.setItem('todo-list', JSON.stringify(todoStorage));
                    saveElementStyles(taskElement, `task-li-${index}-styles`);
                }
            }
        }, { once: true });
    });

    deleteButton.addEventListener('click', () => {
        const index = todoStorage.indexOf(formResult);
        if (index > -1) {
            todoStorage.splice(index, 1);
            localStorage.setItem('todo-list', JSON.stringify(todoStorage));
            localStorage.removeItem(`task-li-${index}-styles`);
            localStorage.removeItem(`task-li-${index}-input-field-styles`); 
        }
        taskElement.remove();
    });

    saveElementStyles(taskElement, `task-li-${todoStorage.length - 1}-styles`);
}

function saveElementStyles(element, key) {
    const computedStyles = window.getComputedStyle(element);
    const stylesToSave = {
        overflow: computedStyles.overflow,
        overflowX: computedStyles.overflowX,
        overflowY: computedStyles.overflowY,
        backgroundColor: computedStyles.backgroundColor,
        fontSize: computedStyles.fontSize,
        maxWidth: computedStyles.maxWidth
    };
    localStorage.setItem(key, JSON.stringify(stylesToSave));
}

function saveInputFieldStyles(inputField, key) {
    const stylesToSave = {
        width: inputField.style.width,
        backgroundColor: inputField.style.backgroundColor,
        textAlign: inputField.style.textAlign
    };
    localStorage.setItem(key, JSON.stringify(stylesToSave));
}

function applyElementStyles(element, key) {
    const storedStyles = localStorage.getItem(key);
    if (storedStyles) {
        const styles = JSON.parse(storedStyles);
        Object.assign(element.style, styles);
    }
}

function applyInputFieldStyles(inputField, key) {
    const storedStyles = localStorage.getItem(key);
    if (storedStyles) {
        const styles = JSON.parse(storedStyles);
        Object.assign(inputField.style, styles);
    }
}

function readTodoStorage(todoStorage) {
    taskList.innerHTML = '';  
    for (let i = 0; i < todoStorage.length; i++) {
        const taskElement = document.createElement('li');
        taskList.appendChild(taskElement);

        const taskText = document.createElement('p');
        taskElement.appendChild(taskText);
        taskText.textContent = todoStorage[i];

        const editButton = document.createElement('button');
        editButton.classList.add('editButton');
        editButton.textContent = 'Edit';
        taskElement.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('deleteButton');
        deleteButton.textContent = 'Delete';
        taskElement.appendChild(deleteButton);

        editButton.addEventListener('click', () => {
            if (taskElement.querySelector('input')) return;

            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = taskText.textContent;

            taskText.textContent = '';
            taskElement.insertBefore(inputField, editButton);
            editButton.textContent = 'Save';

            const inputFieldKey = `task-li-${i}-input-field-styles`;
            applyInputFieldStyles(inputField, inputFieldKey);

            editButton.addEventListener('click', () => {
                const newTaskText = inputField.value.trim();
                if (newTaskText) {
                    taskText.textContent = newTaskText;
                    taskElement.removeChild(inputField);
                    editButton.textContent = 'Edit';

                    const index = todoStorage.indexOf(todoStorage[i]);
                    if (index > -1) {
                        todoStorage[index] = newTaskText;
                        localStorage.setItem('todo-list', JSON.stringify(todoStorage));
                        saveElementStyles(taskElement, `task-li-${index}-styles`);
                    }
                }
            }, { once: true });
        });

        deleteButton.addEventListener('click', () => {
            const index = todoStorage.indexOf(todoStorage[i]);
            if (index > -1) {
                todoStorage.splice(index, 1);
                localStorage.setItem('todo-list', JSON.stringify(todoStorage));
                localStorage.removeItem(`task-li-${index}-styles`);
                localStorage.removeItem(`task-li-${index}-input-field-styles`); 
            }
            taskElement.remove();
        });

        applyElementStyles(taskElement, `task-li-${i}-styles`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    readTodoStorage(todoStorage); 
});

