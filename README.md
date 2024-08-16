# **Smart Attendance System using Face Recognition**

## **Overview**

The Smart Attendance System is a web-based application designed to streamline the process of tracking student attendance using face recognition technology. The system integrates the MERN stack (MongoDB, Express, React, Node.js) for the frontend and backend development, while Django is utilized to handle the machine learning aspect for face recognition.

This project allows teachers to create classrooms, add students, and efficiently manage attendance through real-time face detection and recognition. The integration of Django with the MERN stack ensures that the system is user-friendly, combining modern web development practices with machine learning capabilities.

## **Features**

- **User Authentication**: Register and login to access the system.
- **Classroom Management**: Create and manage classrooms.
- **Student Management**: Add students to specific classrooms.
- **Face Recognition**: Use webcam integration to capture images and recognize student faces.
- **Attendance Management**: Automatically mark attendance based on recognized faces and store data in MongoDB.

## **Technologies Used**

### **Frontend**

- **React**: For building user interfaces.
- **React Router DOM**: For navigation between different views.
- **React Webcam**: For webcam integration.
- **Axios**: For making HTTP requests.
- **Ant Design**: For UI components.
- **Tailwind CSS**: For styling.

### **Backend**

- **Express.js**: For building the backend API.
- **Mongoose**: For database interactions with MongoDB.
- **Nodemon**: For running the server during development.

### **Machine Learning**

- **Python Django**: For handling machine learning tasks, such as training the model and recognizing faces.
- **Haarcascade Frontal Face**: Used for detecting faces in images.
- **LBPH (Local Binary Patterns Histogram) Face Recognizer**: Used for face recognition, trained and utilized via OpenCV's cv2.face module.

**Note:** LBPH may not be highly accurate for larger groups of people or in highly varied conditions, but it is effective for real-time applications with moderate complexity.

**Key Points about LBPH:**

- **Algorithm**: LBPH is a texture-based face recognition algorithm. It works by dividing the face image into several small regions, computing the Local Binary Pattern (LBP) for each region, and then creating a histogram of these patterns. These histograms are used to represent and recognize the face.
- **Face Detection**: Before applying LBPH, face detection is usually done using algorithms like Haar cascades, which identify where faces are located in the image.
- **Recognition Process**: During face recognition, the LBPH algorithm compares the histograms of detected faces with those in the training set to identify and match faces.
- **Advantages**: LBPH is known for its simplicity and robustness in varying lighting conditions and facial expressions. It is suitable for real-time face recognition applications.

## **Getting Started**

### **Prerequisites**

- **Node.js**: Ensure Node.js is installed.
- **MongoDB**: Set up a MongoDB database.
- **Python**: Install Python and create a virtual environment.
- **Django**: Install Django and Django REST Framework.
- **Git**: For cloning the repository.

### **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/ManoharKumar07/Smart-Attendance-System.git
   cd Smart-Attendance-System
   ```

2. **Backend Setup (Express.js)**:

   ```bash
   npm install
   nodemon index.js
   ```

3. **Frontend Setup (React.js)**:

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Machine Learning Setup (Django)**:
   ```bash
   cd Smart Attendance System-ML/env/Scripts/activate
   cd Smart Attendance System-ML/env
   pip install -r requirements.txt
   cd Smart Attendance System-ML/env/AttendanceSystem
   python manage.py runserver
   ```

## **Contributing**

Contributions are welcome! Please fork the repository and create a pull request.
