import os
from typing import List
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Real-Time Chat App")

# Add CORS middleware to allow connections from any origin
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates
templates = Jinja2Templates(directory="templates")

# Create a class to manage WebSocket connections
class ConnectionManager:
    def __init__(self):
        # List to store active connections
        self.active_connections: List[WebSocket] = []

    # Function to accept new connections
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    # Function to disconnect
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    # Function to send a message to a specific client
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    # Function to broadcast a message to all connected clients
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


# Initialize connection manager
manager = ConnectionManager()

# Root route to serve the chat interface
@app.get("/", response_class=HTMLResponse)
async def get(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# WebSocket endpoint
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    # Accept the connection
    await manager.connect(websocket)
    
    # Log connection
    logger.info(f"Client connected: {client_id}")
    
    # Send a welcome message to the new client
    await manager.send_personal_message(f"Welcome to the chat, {client_id}!", websocket)
    
    # Announce to everyone that a new user has joined
    await manager.broadcast(f"User {client_id} has joined the chat")
    
    try:
        # Loop to receive and broadcast messages
        while True:
            # Wait for a message from this client
            data = await websocket.receive_text()
            
            # Log the message (without content for privacy)
            logger.info(f"Message received from {client_id}")
            
            # Broadcast the message with the client ID
            await manager.broadcast(f"{client_id}: {data}")
            
    except WebSocketDisconnect:
        # Handle disconnect
        manager.disconnect(websocket)
        
        # Log disconnection
        logger.info(f"Client disconnected: {client_id}")
        
        # Announce that the user has left
        await manager.broadcast(f"User {client_id} has left the chat")

# Add a health check endpoint for monitoring
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Run the app using Uvicorn
if __name__ == "__main__":
    import uvicorn
    # Create directories if they don't exist
    os.makedirs("static/css", exist_ok=True)
    os.makedirs("static/js", exist_ok=True)
    os.makedirs("templates", exist_ok=True)
    
    # Get port from environment variable for production, or use default for local
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    
    # Run the server
    print(f"Server running! Open http://{host}:{port} in your browser")
    uvicorn.run("main:app", host=host, port=port, reload=True)