# 📋 Patent Management System (PMS)
 
A four-tier distributed information system built with Spring Boot and React.
 
---
 
## 👥 Team
 
| Name | Student ID |
|------|-----------|
| Ayşenur Yılmaz | B231202019 |
| Elif Gül Arslan | B231202061 |
| Rana İrem Özen | B241202002 |
| Vildan Karaca | B231202027 |
 
---
 
## 🏗️ Architecture
 
```
Browser (Tier-4) → React/Node (Tier-3, :5173) → Spring Boot (Tier-2, :8080) → PostgreSQL (Tier-1, :5432)
```
 
---
 
## 🛠️ Technologies
 
- **Backend:** Spring Boot 4.0.1, Java, Hibernate, JasperReports
- **Frontend:** React, Node.js 24.13.0, Vite 8.2.0
- **Database:** MySQL
- **Other:** Bootstrap, Axios
---
 
## ⚙️ Setup
 
### 1. Database
 
Create a MySQL database and update `backend/src/main/resources/application.properties`:
 
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/YOUR_DATABASE_NAME
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```
 
### 2. Backend
 
```bash
cd project4/backend
./gradlew bootRun
```
 
Runs on: `http://localhost:8080`
 
### 3. Frontend
 
```bash
cd project4/frontend
npm install
npm run dev
```
 
Runs on: `http://localhost:5173`
 
---
 
## 📁 Features
 
- ✅ Author, Patent, Certification CRUD operations
- ✅ Image upload & download for authors
- ✅ PDF report generation (JasperReports)
- ✅ Join table view for certifications
- ✅ Exception handling (404, 409)
- ✅ Duplicate certification prevention
---
 
## 📌 API Endpoints
 
### Author
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/author` | Get all authors |
| GET | `/author/get/{id}` | Get author by ID |
| POST | `/author/add` | Add author |
| PUT | `/author/update/{id}` | Update author |
| DELETE | `/author/delete/{id}` | Delete author |
| POST | `/author/upload/{id}` | Upload image |
| GET | `/author/download/{id}` | Download image |
| GET | `/author/view/{id}` | View image |
| GET | `/author/pdf` | Generate PDF |
 
### Patent
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patent` | Get all patents |
| GET | `/patent/get/{id}` | Get patent by ID |
| POST | `/patent/add` | Add patent |
| PUT | `/patent/update/{id}` | Update patent |
| DELETE | `/patent/delete/{id}` | Delete patent |
| GET | `/patent/pdf` | Generate PDF |
 
### Certification
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/certification` | Get all certifications |
| GET | `/certification/join` | Get with author & patent info |
| GET | `/certification/get/{id}` | Get by ID |
| POST | `/certification/add` | Add certification |
| PUT | `/certification/update/{id}` | Update certification |
| DELETE | `/certification/delete/{id}` | Delete certification |
| GET | `/certification/pdf` | Generate PDF |
| GET | `/certification/author/{authorId}` | Get by author |
 
---
 
## 📝 Notes
 
- PDF files are saved to `project4/outputs/`
- Author images are saved to `project4/outputs/images/`
- The `uploadDir` in `AuthorServiceImpl.java` may need to be updated for your local path
