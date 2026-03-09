function saveTasks() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Storage error:', error);
        alert('Storage full! Delete some tasks.');
    }
}