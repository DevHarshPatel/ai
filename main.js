const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Handle sending messages
async function handleSend() {
    const message = userInput.value.trim();
    if (!message) return;

    // Disable input and button while processing
    userInput.disabled = true;
    sendButton.disabled = true;
    
    // Add user message
    appendMessage('user', message);
    
    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';

    // Create assistant message container
    const assistantMessageDiv = document.createElement('div');
    assistantMessageDiv.className = 'message assistant';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    assistantMessageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(assistantMessageDiv);

    try {
        const response = await puter.ai.chat(message, {
            model: 'claude-3-5-sonnet',
            stream: true
        });

        for await (const part of response) {
            if (part?.text) {
                contentDiv.textContent += part.text;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    } catch (error) {
        contentDiv.textContent = 'Sorry, I encountered an error. Please try again.';
    }

    // Re-enable input and button
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function appendMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Event listeners
sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});
