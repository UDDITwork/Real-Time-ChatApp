// Global variables
let username = "";
let ws = null;

// Function to handle joining the chat
function joinChat() {
    // Get the username
    username = document.getElementById("username").value.trim();
    
    if (username.length < 1) {
        alert("Please enter a username");
        return;
    }
    
    // Hide the username form and show the chat interface
    document.getElementById("usernameForm").style.display = "none";
    document.getElementById("chatInterface").style.display = "block";
    
    // Connect to WebSocket server
    connectWebSocket();
    
    // Focus on the message input
    document.getElementById("messageText").focus();
}

// Function to connect to the WebSocket server
function connectWebSocket() {
    // Create WebSocket connection
    ws = new WebSocket(`ws://${window.location.host}/ws/${username}`);
    
    // Connection opened
    ws.onopen = function(event) {
        console.log("Connected to the chat server");
    };
    
    // Listen for messages
    ws.onmessage = function(event) {
        const message = event.data;
        displayMessage(message);
    };
    
    // Connection closed
    ws.onclose = function(event) {
        if (event.wasClean) {
            console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
            console.log('Connection died');
            // Try to reconnect after a delay
            setTimeout(connectWebSocket, 3000);
        }
    };
    
    // Connection error
    ws.onerror = function(error) {
        console.error(`WebSocket error: ${error.message}`);
    };
}

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById("messageText");
    const message = messageInput.value.trim();
    
    if (message.length > 0 && ws) {
        // Send the message through WebSocket
        ws.send(message);
        
        // Clear the input field
        messageInput.value = "";
    }
}

// Function to display a message in the chat
function displayMessage(message) {
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");
    
    // Determine message type (system, user, or other)
    if (message.includes("Welcome to the chat") || 
        message.includes("has joined the chat") || 
        message.includes("has left the chat")) {
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

// Event listener for the Enter key in the message input
document.addEventListener("DOMContentLoaded", function() {
    const messageInput = document.getElementById("messageText");
    
    messageInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
    
    const usernameInput = document.getElementById("username");
    
    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            joinChat();
        }
    });
});