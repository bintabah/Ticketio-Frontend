# **Progress Report - [Ticketio Front]**

## **1. Current Progress ⏳**

📌 **Current Status** :
- [x] Project initialization  
- [x] Environment setup with Docker  
- [x] Angular application structure  
- [x] UI Admin component development
- [x] UI Landing Page component development  
- [x] Backend connection  
- [x] Testing and validation
- [x] Interactice search
- [x] Payment Processor  
- [x] Invoice Generation Ticket  

📢 **Progress Details** :  
> The frontend of the Ticketio project has been developed using **Angular 19.2.5**, following a component-based architecture, and fully dockerized. 

> The application interfaces with the backend REST API, and includes authentication, role-based route protection, and dynamic UI elements built with PrimeNG.

> When the project is launched, the user is redirected to the **landing page** at `http://localhost:4200/`, which displays a **list of concerts** open to the public.  

> This public homepage includes a **search bar** allowing users to filter concerts by **location**, **title**, or **date**.  

> To access management interfaces, users must click on **"Connexion"** in the navigation bar and authenticate.  

> If the database was populated using `JpaTest`, then the default admin credentials are:  
📧 **admin@admin.com** / 🔒 **admin**  

> Only authenticated users with the role `admin` can access protected `/admin/*` routes.  
> ***Updated : 30/04/2025 (11:59PM)***


---

## **2. Working Features and Issues ⚙️**

✅ **What works** :

- **Frontend Architecture and Design:**  
  - Modular folder structure with separation between `components`, `layout`, `views`, `forms`, `models`, `services`, and `guards`.  
  - Use of standalone components and lazy-loaded routes for optimal performance.  
  - Styling handled with SCSS and structured layout using **CSS Grid**, **Flexbox**, and responsive design best practices.  
  - Layout components (top-bar, footer, side-bar) are reusable and isolated.

- **Authentication and Authorization:**  
  - Login form with form validation and JWT handling.  
  - Route protection with `AuthGuard` based on user roles (`admin`).  
  - Tokens are automatically attached to all HTTP requests via a custom interceptor.  
  - Redirection to `/unauthorized` for access violations.

- **Implemented Functionalities:**  
  - **Public homepage** with search input and dynamic concert display.  
  - Full **CRUD** functionalities for:
    - **Users**
    - **Artists**
    - **Events**
    - **Tickets**  
  - **Admin dashboard** accessible only to authorized users.  
  - **Statistics module** (graphs/charts) for admin analytics.  
  - Interface components built using **PrimeNG** widgets (forms, tables, icons, etc.).  
  - Sidebar navigation with dynamic links (`routerLink`) and visual feedback.

- **API Integration:**  
  - Services for each entity (e.g., `UserService`, `EventService`) using `HttpClient`.  
  - Use of RxJS `Observable` pattern for real-time data handling.  
  - Proxy configured to route `/api` calls to backend, avoiding CORS issues.  
  - Centralized error handling and response feedback for users.

- **Development Environment:**  
  - Fully Dockerized using a `.devcontainer` setup.  
  - Angular CLI, Node.js, and npm are preinstalled in the container.  
  - Custom alias `serve` is defined to launch the app using `ng serve`.  
  - Hot reload enabled for fast iteration.

---

### 💡 **Challenges and Solutions**

During the development process, we mainly encountered configuration-related and integration issues. The key challenges were:

- **CORS and API Proxying Issues** 🔗  
  - Initially, the frontend application was unable to reach the backend due to CORS restrictions.  
  - ✅ **Solution:** Implemented a `proxy.conf.json` file to forward Angular's development server requests to the backend.

- **Role-based access protection** 🔐  
  - Implementing route protection for admin users required precise use of guards and route metadata.  
  - ✅ **Solution:** Used Angular’s `canActivate` with a custom `AuthGuard`, and defined `requiredRole` in the route `data`.

- **Shared application state between components** 🔄  
  - Managing tokens, login status, and user roles across components was initially problematic.  
  - ✅ **Solution:** Centralized state management using injectable services with `BehaviorSubject` from RxJS.

- **Docker container performance and port mapping** 🐳  
  - The frontend sometimes failed to serve properly due to incorrect port forwarding or host binding.  
  - ✅ **Solution:** Verified and fixed Docker Compose configurations and made sure the development server binds to `0.0.0.0`.

- **Payment System Integration (Stripe):**  
  - Stripe Checkout has been integrated for online ticket purchases.   
  - Payments are linked to specific ticket data and stored via backend API after confirmation.


---

## **3. How to Start the Project 🚀**

#### ⚠️ **Prerequisites**
a) **Docker Engine 🐳**  
> Used to run Node.js, npm, and Angular CLI in a consistent environment.

b) **Required tools** : Web browser & VSCode (or any other IDE)

---

### **Installation and Execution**

### **1️⃣ Clone the project and go inside its folder**
```sh
git clone https://gitlab2.istic.univ-rennes1.fr/ragbaholou/ticketio_front.git
cd ticketio_front
```

---

### **2️⃣ Setup the environment**
> ⚠️ These instructions are optimized for VSCode with DevContainers.

Open the project in your VSCode  
**(Choose only Process 1 or Process 2 – not both)**

---

### **Process 1 (RECOMMENDED)**

> ⚠️ Install the [DevContainer extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) first.

```sh
# Reopen the project in the container
- Press `Ctrl + Shift + P`
- Type "Rebuild and Open in Container"
- Confirm prompts (press Y + Enter if asked)
- Wait for dependencies (package.json) to be installed
# You can now develop directly inside the container
```

---

### **Process 2**

> (SKIP THIS if Process 1 is already done)

```sh
cd .devcontainer
docker compose up --build

# Check your container
docker ps

# Access the container
docker exec -it [container_id_or_name] bash
# e.g. docker exec -it devcontainer-app-1 bash

# Install Angular dependencies
npm install
```

---

### - - - - - - - INFOS

> ℹ️ At this point:
- Node.js and Angular CLI are installed
- All dependencies are available
- The development environment is ready

---

### **3️⃣ Start the frontend server**

```sh
serve
# This command is an alias for `ng serve`
```

Wait for the Angular CLI to build and expose the app at:

📍 http://localhost:4200

---

### **4️⃣ Available Routes**

| Route                    | Access     | Component                    |
|-------------------------|------------|------------------------------|
| `/`                     | Public     | `PublicHomeComponent`        |
| `/login`                | Public     | `LoginComponent`             |
| `/unauthorized`         | Public     | `UnauthorizedComponent`      |
| `/admin/statistics`     | Admin only | `StatisticsComponent`        |
| `/admin/users`          | Admin only | `UsersComponent`             |
| `/admin/artists`        | Admin only | `ArtistsComponent`           |
| `/admin/events`         | Admin only | `EventsComponent`            |
| `/admin/tickets`        | Admin only | `TicketsComponent`           |
| `**`                    | Redirect   | to `/`                       |

---

## **4. Next Steps**

📝 **Utilities** :
- A card number to test the buying of a ticket is : 4242 4242 4242 4242
- any future date, any CVC, any name.

---

📌 **Additional Information**

👥 **Team Members** : [AGBAHOLOU Romaric Armel](https://gitlab2.istic.univ-rennes1.fr/ragbaholou), [BAH Hadja Sory Binta](https://gitlab2.istic.univ-rennes1.fr/hbah)  
👨‍🏫 **Project Supervisor** : [Chiara Relevat](https://gitlab2.istic.univ-rennes1.fr/crelevat)  
📂 **Frontend Repository** : https://gitlab2.istic.univ-rennes1.fr/ragbaholou/ticketio_front  
📂 **Backend Repository** : https://gitlab2.istic.univ-rennes1.fr/ragbaholou/ticketio_back
