// Global variables
let username = "";
let ws = null;

// Debug logging
function log(message, data) {
    console.log(`[Chat App] ${message}`, data || '');
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function() {
    log("DOM fully loaded, initializing app");
    
    // Set up event listeners for the username form
    setupUsernameForm();
    
    // Set up event listeners for the chat interface
    setupChatInterface();
});

// Setup username form events
function setupUsernameForm() {
    const usernameInput = document.getElementById("username");
    const joinButton = document.getElementById("joinButton");
    
    if (!usernameInput || !joinButton) {
        log("Error: Username form elements not found", { usernameInput, joinButton });
        return;
    }
    
    // Focus on username input when page loads
    usernameInput.focus();
    
    // Handle Enter key in username input
    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            joinChat();
        }
    });
    
    // Handle click on join button
    joinButton.addEventListener("click", function() {
        joinChat();
    });
    
    log("Username form setup complete");
}

// Setup chat interface events
function setupChatInterface() {
    const messageInput = document.getElementById("messageText");
    const sendButton = document.getElementById("sendButton");
    
    if (!messageInput || !sendButton) {
        log("Chat interface elements not fully available yet");
        return;
    }
    
    // Handle Enter key in message input
    messageInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
    
    // Handle click on send button
    sendButton.addEventListener("click", function() {
        sendMessage();
    });
    
    log("Chat interface setup complete");
}

// Function to handle joining the chat
function joinChat() {
    log("Join chat function called");
    
    // Get the username
    const usernameInput = document.getElementById("username");
    username = usernameInput.value.trim();
    
    if (username.length < 1) {
        alert("Please enter a username");
        usernameInput.focus();
        return;
    }
    
    log("Username entered:", username);
    
    // Hide the username form and show the chat interface
    document.getElementById("usernameForm").style.display = "none";
    document.getElementById("chatInterface").style.display = "block";
    
    // Connect to WebSocket server
    connectWebSocket();
    
    // Focus on the message input
    const messageInput = document.getElementById("messageText");
    if (messageInput) {
        messageInput.focus();
    }
}

// Function to connect to the WebSocket server
function connectWebSocket() {
    // Close existing connection if any
    if (ws) {
        log("Closing existing WebSocket connection");
        ws.close();
    }
    
    // Determine the correct WebSocket protocol based on the page protocol
    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const wsUrl = `${wsProtocol}${window.location.host}/ws/${username}`;
    
    log("Connecting to WebSocket at:", wsUrl);
    
    try {
        // Create new WebSocket connection
        ws = new WebSocket(wsUrl);
        
        // Connection opened
        ws.onopen = function(event) {
            log("WebSocket connection established");
            displayMessage("Connected to chat server", "system");
        };
        
        // Listen for messages
        ws.onmessage = function(event) {
            const message = event.data;
            log("Message received:", message);
            displayMessage(message);
        };
        
        // Connection closed
        ws.onclose = function(event) {
            if (event.wasClean) {
                log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
                displayMessage(`Disconnected from chat server (${event.reason || 'Connection closed'})`, "system");
            } else {
                log('Connection died unexpectedly');
                displayMessage("Connection to chat server lost. Attempting to reconnect...", "system");
                
                // Try to reconnect after a delay
                setTimeout(connectWebSocket, 3000);
            }
        };
        
        // Connection error
        ws.onerror = function(error) {
            log("WebSocket error:", error);
            displayMessage("Error connecting to chat server. Please refresh the page and try again.", "system");
        };
    } catch (error) {
        log("Failed to create WebSocket:", error);
        displayMessage("Failed to connect to chat server: " + error.message, "system");
    }
}

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById("messageText");
    const message = messageInput.value.trim();
    
    if (message.length === 0) {
        return; // Don't send empty messages
    }
    
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        log("Cannot send message, WebSocket not connected");
        displayMessage("Not connected to chat server. Please refresh the page.", "system");
        return;
    }
    
    log("Sending message:", message);
    
    try {
        // Send the message through WebSocket
        ws.send(message);
        
        // Clear the input field
        messageInput.value = "";
        messageInput.focus();
    } catch (error) {
        log("Error sending message:", error);
        displayMessage("Failed to send message: " + error.message, "system");
    }
}

// Function to display a message in the chat
function displayMessage(message, type) {
    const messagesDiv = document.getElementById("messages");
    if (!messagesDiv) {
        log("Messages container not found");
        return;
    }
    
    const messageElement = document.createElement("div");
    
    // Determine message type (system, user, or other)
    if (type === "system" || 
        message.includes("Welcome to the chat") || 
        message.includes("has joined the chat") || 
        message.includes("has left the chat") ||
        message.includes("Connected to chat server") ||
        message.includes("Disconnected from chat server") ||
        message.includes("Error connecting")) {
        messageElement.className = "message system-message";
    } else if (message.startsWith(`${username}:`)) {
        messageElement.className = "message user-message";
    } else {
        messageElement.className = "message other-message";
    }
    
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    
    // Scroll to the bottom to see the latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}