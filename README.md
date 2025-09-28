# Absensi Karyawan (DEXA Absensi)
*A small full-stack attendance system: employees can log daily attendance with a photo; admins can manage employees and review attendance.*

 Live Demo: https://absensi-karyawan.onrender.com/
 
 Instructions: You may log in as the admin with the email admin@dexa.org and password123. Every sample employee profile with the email that ends with @dexa.org you see in the database is also accessible with that same password.
 ## Tech Stack
-   **Frontend:** React + Vite, Tailwind
-   **Backend:** Node.js, Express, Mongoose (MongoDB)
-   **Auth:** JWT (http-only cookie or bearer token)
-   **Uploads:** Multer -> saved to `/uploads` (served statically)
-   **Deployment:** Render
## Features
-   **Employees**
    -   Login, personal dashboard
    -  Log attendance for today with photo proof
    -   See personal attendance history (with pagination)
    -   Edit profile (name, phone, etc.)
-   **Admin**
	- Also log attendance, counted as emplyoee
    -   View/search/paginate all employees
    -   View attendances for a specific date (present/absent, timestamp, proof)
    -   Create/update employees
## Screenshots
### Login page
<img width="1917" height="945" alt="image" src="https://github.com/user-attachments/assets/8b16155d-0d69-4cb7-9148-01486b0a0695" />

### Dashboard for admin
<img width="1902" height="936" alt="image" src="https://github.com/user-attachments/assets/fadf3c21-0fce-4243-a165-fce02c40f7af" />
<img width="1902" height="947" alt="image" src="https://github.com/user-attachments/assets/72efe9f1-b144-419a-9f66-99075bc08afe" />

### Dashboard for employees/non-admins

Before logging attendance:
<img width="1908" height="943" alt="image" src="https://github.com/user-attachments/assets/193d3cba-1470-40e4-8b56-16c79e7f25cc" />

### Employees page
<img width="1898" height="944" alt="image" src="https://github.com/user-attachments/assets/625c6c0c-6dd4-4541-b82a-388388910f34" />

### Adding new employee
<img width="1910" height="939" alt="image" src="https://github.com/user-attachments/assets/0fa74e6b-bddd-45a5-bbc8-88b2df432e6b" />

### Attendances page
<img width="1903" height="942" alt="image" src="https://github.com/user-attachments/assets/a8d7fbfe-a0b9-44f6-8ba5-adf1b69e2276" />

### All employee dashboards are accessible by the admin
<img width="1903" height="940" alt="image" src="https://github.com/user-attachments/assets/1d79cc80-d4d0-423e-83ac-518ae07349c7" />

Admins can freely edit the profile of any employee
<img width="1912" height="942" alt="image" src="https://github.com/user-attachments/assets/d4462ec7-ce84-487d-8f84-7bbc3fd6a4ae" />

Please access the demo for more!

## Design Decisions / Comments
- Images: Stored locally in uploads folder, but are stored as links in the database. In a real-world app, we would use a storage service like S3
- Roles/Departments: For this project, I have hardcoded the roles & departments into the API. In a real-world app, this would be stored in a separate database.
- Passwords: Hashed (bcrypt) in database.
- Testing: No unit testing yet. I have only done manual testing, using Thunder Client for for the backend. Given more time, I would have made better use of automatic testing.

## Ideas for expansion (on my to-do if I had more time)
- Enforcing constraints while calling backend routes -- e.g no duplicate emails when creating, phone number format
- Check-in/check-out time instead of one-click logging. Track how many hours of work done.
- Check for weekdays/holidays (tanggal merah). Allow user or admin to log leaves instead of attendance (e.g sick leave, maternity leave, etc.)
