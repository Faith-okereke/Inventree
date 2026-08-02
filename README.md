# Inventree API

A robust and scalable REST API for an inventory management system, built with Node.js, Express, and TypeScript.

## ✨ Features

*   **Authentication:** Secure user registration and login using JWT.
*   **Product Management:** Full CRUD operations for products.
*   **Order Processing:** Create and manage customer orders.
*   **Dashboard Analytics:** Endpoints to provide summary data for a frontend dashboard.
*   **Validation:** Robust request validation using [Zod](https://zod.dev/).
*   **API Documentation:** Interactive API documentation available via Swagger.
*   **Health Checks:** A dedicated endpoint to monitor application status.

## 🛠️ Tech Stack

*   **Backend:** Node.js, Express.js
*   **Language:** TypeScript
*   **Validation:** Zod
*   **API Documentation:** Swagger UI
*   **Database:** (Requires a database like PostgreSQL or MongoDB)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A running database instance (e.g., PostgreSQL, MongoDB)

### Installation

1.  **Clone the repository**

    ```bash
    git clone <your-repository-url>
    cd Inventree
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up environment variables**

    Create a `.env` file in the root of the project and add the necessary configuration.

    ```bash
    cp .env.example .env
    ```

    Then, update the `.env` file with your specific settings.

    ```ini
    # Server Configuration
    SERVER_PORT=3000

    # Database Connection
    # Example for PostgreSQL: DATABASE_URL="postgresql://user:password@localhost:5432/inventree?schema=public"
    DATABASE_URL=

    # JWT Secret for Authentication
    JWT_SECRET=your-super-secret-jwt-key
    ```

## 🏃‍♀️ Running the Project

*   **For development (with hot-reloading):**

    ```bash
    npm run dev
    ```

*   **For production:**

    ```bash
    npm run build
    npm start
    ```

The server will start on the port specified in your `.env` file (default is `3000`).

## API Endpoints

Once the server is running, the following API endpoints will be available:

*   **Authentication:** `/api/auth`
    *   `POST /api/auth/register`
    *   `POST /api/auth/login`
*   **Products:** `/api/products`
    *   `GET /api/products`
    *   `POST /api/products`
    *   `GET /api/products/:id`
    *   `PUT /api/products/:id`
    *   `DELETE /api/products/:id`
*   **Orders:** `/api/orders`
    *   `GET /api/orders`
    *   `POST /api/orders`
*   **Dashboard:** `/api/dashboard`
    *   `GET /api/dashboard/summary`
*   **API Documentation:**
    *   Navigate to `http://localhost:3000/api-docs` in your browser to view the interactive Swagger documentation.
*   **Health Check:**
    *   `GET /health` - Returns a JSON object indicating the application's status.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---
"# Inventree" 
