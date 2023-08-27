# Attendance Management System - Backend

The backend of the Attendance Management System is built using Node.js and Express. It handles the API endpoints, connects to the MySQL database, and performs the necessary operations for managing attendance records.

## Prerequisites

Before running the backend server, make sure you have the following installed:

- Node.js
- MySQL Server

## Getting Started

1. Clone or download the project files from the repository.

2. Install the dependencies by running the following command in the project's root directory:

```shell
npm install
```

3. Set up the MySQL database:

   - Make sure you have a MySQL server running locally.
   - Create a new database named `ams_db` (or modify the `database` field in the code to match your desired database name).
   - Update the `user` and `password` fields in the code to match your MySQL server credentials.

4. Start the backend server by running the following command:

```shell
npm start
```

The server will start listening on port 3001.

## Error Handling

The backend code includes basic error handling. In case of any errors during the database connection or API requests, appropriate error responses are sent to the client.

## Customization

You can customize the code to fit your specific attendance management system requirements. Feel free to modify the code to include additional API endpoints, implement authentication and authorization, or handle additional database operations.

## License

The Attendance Management System is released under the [MIT License](LICENSE).
