let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

function addTask() {
    const input = document.getElementById('taskInput');
    const reminderInput = document.getElementById('reminderInput');
    const taskText = input.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        createdAt: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        reminder: reminderInput.value ? new Date(reminderInput.value).toLocaleString() : null,
        reminderTime: reminderInput.value || null,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    
    input.value = '';
    reminderInput.value = '';

    // Set reminder if provided
    if (task.reminderTime) {
        setReminder(task);
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function setReminder(task) {
    const reminderDate = new Date(task.reminderTime);
    const now = new Date();
    const timeDiff = reminderDate - now;

    if (timeDiff > 0) {
        setTimeout(() => {
            showNotification(task);
        }, timeDiff);
    }
}

function showNotification(task) {
    // Show in-app notification
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = `"${task.text}" - Time to complete this task!`;
    notification.classList.add('show');

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Task Reminder!', {
            body: task.text,
            icon: 'https://cdn-icons-png.flaticon.com/512/732/732200.png'
        });
    }

    // Play sound
    playNotificationSound();

    // Auto hide after 10 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 10000);
}

function closeNotification() {
    document.getElementById('notification').classList.remove('show');
}

function playNotificationSound() {
    const audio = new Audio('audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
    audio.play().catch(e => console.log('Audio play failed'));
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    // Update stats
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;

    if (tasks.length === 0) {
        taskList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        li.innerHTML = `
            <div class="task-header">
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-actions">
                    <button class="btn-icon btn-complete" onclick="toggleComplete(${task.id})" title="Mark as complete">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteTask(${task.id})" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="task-meta">
                <div><i class="fas fa-calendar-plus"></i> Added: ${task.createdAt}</div>
                ${task.reminder ? `<div class="reminder-badge"><i class="fas fa-clock"></i> Reminder: ${task.reminder}</div>` : ''}
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow Enter key to add task
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks();

// Check for reminders on page load
tasks.forEach(task => {
    if (task.reminderTime && !task.completed) {
        setReminder(task);
    }
});