const chatContainer = document.querySelector('#chat-container');
const messageInput = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const fileInput = document.querySelector('#file-upload');
const messagesContainer = document.querySelector('#messages-container');

let messages = [];

function createMessageElement(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`;
    
    const innerDiv = document.createElement('div');
    innerDiv.className = `${isUser ? 'bg-purple-600 text-white' : 'bg-slate-100'} rounded-lg px-4 py-2 max-w-[80%]`;
    innerDiv.textContent = content;
    
    messageDiv.appendChild(innerDiv);
    return messageDiv;
}

async function sendMessage(content) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role: 'user',
                content: content
            })
        });
        
        const data = await response.json();
        return data.messages[data.messages.length - 1].content;
    } catch (error) {
        console.error('Error sending message:', error);
        return 'Sorry, there was an error processing your message.';
    }
}

async function handleSendMessage() {
    const content = messageInput.value.trim();
    if (!content) return;
    
    messageInput.value = '';
    
    // Add user message
    const userMessage = createMessageElement(content, true);
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Get AI response
    const response = await sendMessage(content);
    
    // Add AI response
    const aiMessage = createMessageElement(response, false);
    messagesContainer.appendChild(aiMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        // Add file upload message
        const uploadMessage = createMessageElement(`Uploading file: ${file.name}...`, true);
        messagesContainer.appendChild(uploadMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        // Add result message
        let resultMessage;
        if (result.credit_score) {
            resultMessage = createMessageElement(`Based on your uploaded data, your predicted credit score is: ${result.credit_score}`, false);
        } else {
            resultMessage = createMessageElement(result.message || 'File processed successfully', false);
        }
        messagesContainer.appendChild(resultMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Clear file input
        fileInput.value = '';
    } catch (error) {
        console.error('Error uploading file:', error);
        const errorMessage = createMessageElement('Sorry, there was an error processing your file. Please try again.', false);
        messagesContainer.appendChild(errorMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

sendButton.addEventListener('click', handleSendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});
fileInput.addEventListener('change', handleFileUpload);
