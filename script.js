function deleteTask(id) {
    // Task exist karta hai ya nahi check karein
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
        console.warn(`Task with id ${id} not found`);
        return;
    }

    const task = tasks[taskIndex];
    
    // Sweet confirmation with task name
    const confirmMessage = `Are you sure you want to delete:\n\n"${task.text}"?`;
    
    if (confirm(confirmMessage)) {
        // Task remove karein
        tasks.splice(taskIndex, 1);
        
        // LocalStorage update karein
        saveTasks();
        
        // UI re-render karein
        renderTasks();
        
        // Optional: Success feedback (toast/notification)
        showTemporaryMessage('Task deleted successfully! ✅', 'success');
    }
}
function showTemporaryMessage(message, type = 'info') {
    // Existing notification element reuse karein ya naya banayein
    const tempMsg = document.createElement('div');
    tempMsg.className = `temp-message ${type}`;
    tempMsg.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: ${type === 'success' ? '#28a745' : '#667eea'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 2000;
        animation: slideUp 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    `;
    tempMsg.textContent = message;
    
    document.body.appendChild(tempMsg);
    
    // 3 seconds baad remove karein
    setTimeout(() => {
        tempMsg.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => tempMsg.remove(), 300);
    }, 3000);
}

// CSS animations add karein style.css mein (optional)
/*
@keyframes slideUp {
    from { opacity: 0; transform: translate(-50%, 20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes slideDown {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, 20px); }
}
*/