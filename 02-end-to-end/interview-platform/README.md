# Online Coding Interview Platform

This is an end-to-end online coding interview platform that allows real-time collaborative coding.

## Features
- Real-time code synchronization
- Syntax highlighting
- Code execution (Planned)
- Interview rooms

## Prerequisites
- Node.js installed

## Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd interview-platform
    ```

2.  **Install Server Dependencies**
    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies**
    ```bash
    cd ../client
    npm install
    ```

## Running the Application

### Server
To start the backend server (runs on port 3001):
```bash
cd server
npm run dev
```

### Client
To start the frontend application:
```bash
cd client
npm run dev
```

## Running Tests
Integration tests are located in the `server` directory.

```bash
cd server
npm test
```

## Docker (Containerization)
Build the image:
```bash
docker build -t interview-platform .
```

Run the container:
```bash
docker run -p 3001:3001 interview-platform
```

## Deployment
This application is ready for deployment on services like **Render**.

1.  Create a new Web Service on Render.
2.  Connect your GitHub repository.
3.  Select `Docker` as the Runtime.
4.  Render will automatically build and deploy using the `Dockerfile`.
