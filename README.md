# Dawn News Archive Search Retrieval System

## How to Run:

1. **Backend Setup:**
   - Install Python: [Download Python](https://www.python.org/downloads/)
   - Install All dependencies by running these commands in terminal:
     Install Flask
    ```bash
     pip install Flask
     ```
    Install Flask-CORS
     ```bash
     pip install Flask-CORS
     ```
     Install Beautiful Soup
     ```bash
     pip install beautifulsoup4
     ```
     Install NLTK
     ```bash
     pip install nltk
     ```
     Install Pymongo
     ```bash
     pip install pymongo
     ```
   - Or directly run this file `pip install -r requirements.txt`
   - requirements.txt:
      ```bash
     Flask==2.0.1
     Flask-CORS==3.0.10
     beautifulsoup4==4.10.0
     nltk==3.6.3
     pymongo==3.12.0
      ```

   - Ensure MongoDB is installed and running.

1. **Frontend Setup:**
   - Install Node.js: [Download Node.js](https://nodejs.org/)
   - Create a React App: Run `npx create-react-app my-react-app` in the terminal.
   - Navigate to the React app directory: Run `cd my-react-app`.
   - Install dependencies: Run `npm install`.
   - Start the React development server: Run `npm start`.

2. **Run the System:**
   - Open two terminals.
   - In one terminal, navigate to the frontend directory (`my-react-app`) and run `npm start`.
   - In the other terminal, navigate to the backend directory and run `python main.py`.

3. **Access the System:**
   - Frontend: Visit `http://localhost:3000` in your browser.
   - Backend: Flask server is running at `http://localhost:5000`.

## Notes:
- Ensure all dependencies are installed before running the system.
- Backend and frontend should be running simultaneously for the full functionality.
- For detailed dependencies, refer to `requirements.txt` for the backend and the `package.json` for the frontend.
- Feedback and issues are welcome.

