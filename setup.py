#!/usr/bin/env python3
"""
Setup script for Smart Fitness & Nutrition Coach application.
This script sets up the database and seeds it with initial data.
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, cwd=None):
    """Run a command and return success status."""
    try:
        result = subprocess.run(command, shell=True, check=True, cwd=cwd, 
                              capture_output=True, text=True)
        print(f"✅ Success: {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running: {command}")
        print(f"   {e.stderr}")
        return False

def main():
    """Main setup function."""
    print("🚀 Setting up Smart Fitness & Nutrition Coach")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("backend") or not os.path.exists("frontend"):
        print("❌ Please run this script from the project root directory")
        sys.exit(1)
    
    # Backend setup
    print("\n📦 Setting up backend...")
    
    # Check if Python virtual environment exists
    venv_path = Path("backend/venv")
    if not venv_path.exists():
        print("Creating Python virtual environment...")
        if not run_command("python -m venv venv", cwd="backend"):
            print("❌ Failed to create virtual environment")
            sys.exit(1)
    
    # Determine the correct activation script
    if os.name == 'nt':  # Windows
        activate_script = "venv\\Scripts\\activate"
        pip_path = "venv\\Scripts\\pip"
        python_path = "venv\\Scripts\\python"
    else:  # Unix/MacOS
        activate_script = "source venv/bin/activate"
        pip_path = "venv/bin/pip"
        python_path = "venv/bin/python"
    
    # Install Python dependencies
    print("Installing Python dependencies...")
    if not run_command(f"{pip_path} install -r requirements.txt", cwd="backend"):
        print("❌ Failed to install Python dependencies")
        sys.exit(1)
    
    # Run database seed script
    print("Setting up database and seeding with sample data...")
    if not run_command(f"{python_path} seed_data.py", cwd="backend"):
        print("❌ Failed to seed database")
        sys.exit(1)
    
    # Frontend setup
    print("\n📦 Setting up frontend...")
    
    # Check if Node.js is available
    if not run_command("node --version"):
        print("❌ Node.js is not installed. Please install Node.js first.")
        sys.exit(1)
    
    # Install npm dependencies
    print("Installing npm dependencies...")
    if not run_command("npm install", cwd="frontend"):
        print("❌ Failed to install npm dependencies")
        sys.exit(1)
    
    # Success message
    print("\n🎉 Setup completed successfully!")
    print("\nTo start the application:")
    print("1. Start the backend:")
    print("   cd backend")
    if os.name == 'nt':
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("   uvicorn main:app --reload")
    print("\n2. In a new terminal, start the frontend:")
    print("   cd frontend")
    print("   npm start")
    print("\n3. Open your browser to http://localhost:3000")
    print("\nDefault database will be SQLite. For PostgreSQL, update the DATABASE_URL in backend/config.py")

if __name__ == "__main__":
    main() 