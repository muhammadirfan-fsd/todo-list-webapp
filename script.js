function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// renderTasks mein use karein:
li.innerHTML = `
    <div class="task-text">${escapeHtml(task.text)}</div>
    ...
`;