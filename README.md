# FLASH Encrypt
"FLASH Encrypt": Secure Collaboration
"FLASH Encrypt" is a FastAPI-based app tackling big companies' fears of data theft from cloud tools like Zoom, Microsoft, and Google Docs by offering a secure, self-hosted platform for sensitive operations.
Problem
Fears of monitoring and data theft in SaaS tools risk exposing startup operations.

Data Risks: Admin access and vulnerabilities (e.g., OAuth flaws) leak sensitive data.
Legal Concerns: U.S.-based cloud storage enables surveillance via legal requests.
Misuse: Unsecured accounts expose proprietary plans.

Solution
"FLASH encrypt" ensures private collaboration with end-to-end encryption and self-hosted control.


License
MIT - see LICENSE.
Contact
Open an issue or email solutions@paneura.site


A simple real-time chat application built with FastAPI and WebSockets.

## Features

- Real-time messaging without page refresh
- User identification with usernames
- Join/leave notifications
- Automatic reconnection if connection is lost
- Simple, clean UI

## Deployment to Render.com

This application is designed to be easily deployed to Render.com:

1. Push your code to a GitHub repository
2. Sign up for Render.com
3. Create a new Web Service
4. Connect your GitHub repository
5. Use these settings:
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Select the free plan

## Important Files

- `main.py`: FastAPI application
- `static/css/style.css`: Styling
- `static/js/chat.js`: WebSocket client code
- `templates/index.html`: HTML interface
- `requirements.txt`: Dependencies
- `Procfile`: Instructions for Render.com

## Local Development

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
2. Run the application:
   ```
   python main.py
   ```
3. Open your browser and navigate to http://localhost:8000

## Troubleshooting Render.com Deployment

If you encounter issues with your deployment:

1. Check that you're using port binding correctly:
   - Make sure your app listens on `0.0.0.0` for the host
   - Make sure your app uses the `$PORT` environment variable
   
2. WebSocket Connection Issues:
   - Check that your JavaScript correctly handles both `ws://` and `wss://` protocols
   - Make sure CORS middleware is enabled in your FastAPI app
   
3. Monitor the logs in the Render dashboard for error messages