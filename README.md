# Real-Time Chat Application

A simple but functional real-time chat application built with FastAPI and WebSockets.

## Features

- Real-time messaging without page refresh
- User identification with usernames
- Join/leave notifications
- Automatic reconnection if connection is lost
- Simple, clean UI

## Technologies Used

- **FastAPI**: Modern, high-performance web framework for building APIs
- **WebSockets**: Protocol for real-time, two-way communication
- **Uvicorn**: ASGI server for running the application
- **Jinja2**: Template engine for rendering HTML
- **JavaScript**: Client-side logic for WebSocket communication-chat.js application

## Local Development

1. Clone this repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the application:
   ```
   python main.py
   ```
4. Open your browser and navigate to http://localhost:8000

## Deployment

This application is ready to be deployed to cloud platforms like Render, Heroku, or Railway.

## License

MIT