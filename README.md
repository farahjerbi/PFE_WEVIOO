# Notification Platform - Final Year Project 🚀

Welcome to the **Notification Platform Based on Microservices Architecture** – a powerful solution to centralize and automate notifications such as emails, SMS, web push notifications, and more! This project is designed to handle notifications in a scalable, modular, and resilient way.

### 🌟 Features
- 🔐 **JWT Authentication**: Secure authentication for users using JSON Web Tokens (JWT).
- 💌 **Email Notifications**: Sending dynamic and personalized email notifications.
- 📱 **SMS Notifications**: Integration with Infobip API for reliable SMS delivery.
- 🖥️ **Web Push Notifications**: Seamless push notifications for Progressive Web Apps (PWA).
- 🗣️ **Search Engine**: Advanced search engine for finding notification templates using NLP (SpaCy & Transformers).
- ⚙️ **File Management**: Excel file upload and processing for bulk data management.
- 🛠️ **CI/CD Pipeline**: Automated deployment and testing with GitLab CI/CD.
- 🔑 **OTP (One-Time Password)**: Secure login and verification system using OTP for an additional layer of authentication.
- 🧑‍💼 **Profile Management**: Allow users to manage their profiles, including personal details and notification preferences.
- 📑 **Template Management**: Easy creation, editing, and management of dynamic notification templates (email, SMS, push notifications) with customizable inputs.
- 🖱️ **Email Editor Integration**: Drag-and-drop email editor integrated into the frontend, enabling users to design custom email templates visually.

### 📚 Tech Stack
#### Frontend:
- **React** with **TypeScript**
- **Redux Toolkit** & **Redux Toolkit Query** for state management and API caching
- **Material-UI** for a modern, responsive UI

#### Backend:
- **Spring Boot** for microservices (Authentication, Email, SMS, Push Notifications)
- **Flask** for advanced search engine with NLP models (SpaCy & Transformers)
- **Docker** for containerization and **Docker Compose** for orchestration

#### Notification Services:
- **Infobip API** for SMS & WhastApp notifications
- **Service Workers** for push notifications to PWAs

#### Infrastructure:
- **GitLab CI/CD** for automated testing and deployment
- **Docker** for service containerization and orchestration

