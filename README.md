# Clinica

**Clinica** is a freelance project that I'm currently developing. It's a fullstack application built with Next.js, managing clinic resources like patients, doctors, and appointments.

## Getting Started

Follow these steps to set up the project on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Bun](https://bun.sh) (for managing dependencies and running the project)
- MySQL database

### Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/clinica.git
    cd clinica
    ```

2. **Configure environment variables**:
    - Copy the example environment file and configure your MySQL credentials:
      ```bash
      cp .env.example .env
      ```
    - Edit the `.env` file to include your MySQL database credentials and any other necessary configurations.

3. **Install dependencies**:
    Use Bun to install the required dependencies:
    ```bash
    bun install
    ```

4. **Run database migrations**:
    Ensure your MySQL database is set up and run the migrations:
    ```bash
    bun run db:migrate
    ```

5. **Start the development server**:
    To launch the development server:
    ```bash
    bun run dev
    ```

    The app will be available at `http://localhost:3000`.

### Scripts

Here are some useful scripts for development:

- **Install dependencies**:  
  ```bash
  bun install
  ```
  
- **Run database migrations**:  
  ```bash
  bun run db:migrate
  ```
  
- **Start the development server**:  
  ```bash
  bun run dev
  ```

## Technologies Used
- **Next.js**: Fullstack framework for both the frontend and backend.
- **tRPC**: End-to-end typesafe APIs without needing a REST or GraphQL setup.
- **Drizzle ORM**: Lightweight, type-safe ORM for SQL databases, ensuring smooth interaction with the MySQL database.
- **Bun**: Fast all-in-one JavaScript runtime for running the server and managing dependencies.
- **MySQL**: Relational database for storing clinic data.
- **TypeScript**: Ensures type safety throughout the project, including frontend, backend, and database interactions.
