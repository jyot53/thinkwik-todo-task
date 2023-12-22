# Thinkwik TODO Task - MERN Stack Application

## Project Structure

The repository consists of two main folders:

1. **Client:**
   - Frontend built using ReactJS and Typescript.

2. **Server:**
   - Backend developed with NodeJS and ExpressJS.
   - MongoDB is utilized as the database.

## Running the Application

Follow these steps to run the application successfully:

### 1. Client

- Navigate to the `client` folder.
  ```sh
  cd client
  ```

- Install dependencies.
  ```
    npm install
  ```

- Start the client application.
  ```
  npm run start
  ```

- Open your browser and go to [http://localhost:3000](http://localhost:3000) to access the frontend.

### 2. Server

- Navigate to the `server` folder.
  ```sh
  cd server
  ```

- Create a .env file in server folder and copy the contents of .env.sample into it.

- Install server dependencies.
  ```
  npm install
  ```

- Run the server in development mode.
  ```
  npm run dev
  ```

- The server will be listening on [http://localhost:8000](http://localhost:8000).

## Summary

This MERN (MongoDB, ExpressJS, ReactJS, NodeJS) stack application is organized into separate frontend and backend folders. Follow the steps outlined above to set up and run the application. The client runs on [http://localhost:3000](http://localhost:3000), and the server runs on [http://localhost:8000](http://localhost:8000).

## Sample User Information
{
  "email":"jyotsoni0053@gmail.com",
  "username":"jyot53",
  "password":"jyotsoni53"
}

## Take Care 
- If the Frontend port is running other than 3000, update the CORS_ORIGIN url in the env file on server side
- If the backend port is running on other than 8000, update the route in proxy in package.json file
