# PERN Stack - Basic CRUD Application

---

This project provides a simple Create, Read, Update, and Delete (CRUD) application built with the PERN stack (PostgreSQL, Express.js, React, Node.js).

## Requirements

To run this application, you'll need:

* **Docker**

---

## How to Run

Follow these steps to get the application up and running on your local machine:

1.  **Clone the Repository:** Download or clone this project to your local system.
2.  **Navigate to Project Folder:** Open a terminal and change your directory to the project's root folder.
3.  **Start Docker Containers:** Run the following command to build and start all necessary services in detached mode:

    ```bash
    $ docker compose --build -d
    ```

4.  **Verify Container Status:** Check if all containers are running correctly:

    ```bash
    $ docker ps
    ```

    You should see output similar to this, indicating the status of your `frontend`, `backend`, `pgadmin`, and `db` containers:

    ```
    CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS                     PORTS                                             NAMES
    b10edb1c429e        fullstack-pern-frontend     "docker-entrypoint.s…"   25 seconds ago      Up 15 seconds              0.0.0.0:5173->5173/tcp, :::5173->5173/tcp         fullstack-pern-frontend-1
    00a585877b71        fullstack-pern-backend      "docker-entrypoint.s…"   25 seconds ago      Up 25 seconds              5000/tcp, 0.0.0.0:5000->8080/tcp, :::5000->8080/tcp   fullstack-pern-backend-1
    24a78d5f5dcb        dpage/pgadmin4              "/entrypoint.sh"         25 seconds ago      Up 25 seconds              443/tcp, 0.0.0.0:8080->80/tcp, :::8080->80/tcp      fullstack-pern-pgadmin-1
    d9082a6455b5        postgres:16-alpine          "docker-entrypoint.s…"   15 seconds ago      Up 15 hours (healthy)      0.0.0.0:5432->5432/tcp, :::5432->5432/tcp         fullstack-pern-db-1
    ```

5.  **Run Backend Seeders:** Populate your database with initial data:

    * **Option A (Recommended):** Navigate into the backend project folder and run the seeders directly.

        ```bash
        $ cd backend
        $ npx sequelize-cli db:seed:all
        ```

    * **Option B (Troubleshooting):** If Option A fails, you might need to execute the seeders within the backend container.

        ```bash
        $ docker exec fullstack-pern-backend-1 -it sh
        ```

        This will give you a shell inside the container, typically at `/app`. From there, run the seeders:

        ```bash
        /app $ npx sequelize-cli db:seed:all
        ```

6.  **Access the Application:** Open your web browser and go to: [http://localhost:5173](http://localhost:5173)

7.  **Login Credentials:** You can sign in to the web application with the following credentials:
    * **User:** `admin@example.com`
    * **Password:** `password`

---

## Alternatives and Customization

* **PgAdmin Access:** The stack includes **PgAdmin** for convenient database management via a web browser.
    * **Access URL:** Typically accessible through [http://localhost:8080](http://localhost:8080) (as per the `docker ps` output, where `8080` maps to the internal `80` port of pgAdmin).
    * **Credentials:**
        * **User:** `admin@admin.com`
        * **Password:** `adminPass`
* **Customization:** You can modify the `docker-compose.yaml` file and individual `Dockerfile`s to customize the stack configuration to your specific needs.
