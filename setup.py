import os
import subprocess
import sys

def install_dependencies():
    """Install required packages"""
    print("Installing required packages...")
    packages = ["fastapi", "uvicorn", "jinja2", "aiofiles", "websockets"]
    
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + packages)
        print("All dependencies installed successfully!")
    except subprocess.CalledProcessError:
        print("Failed to install dependencies. Please install them manually:")
        print("pip install fastapi uvicorn jinja2 aiofiles websockets")
        sys.exit(1)

def create_directories():
    """Create the required directories if they don't exist"""
    print("Creating project directories...")
    directories = ["static/css", "static/js", "templates"]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

def main():
    """Main setup function"""
    print("Setting up Real-Time Chat Application...")
    install_dependencies()
    create_directories()
    print("\nSetup complete! You can run the application with:")
    print("python main.py")

if __name__ == "__main__":
    main()