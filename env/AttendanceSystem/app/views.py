from django.http import HttpResponse
from django.conf import settings
import csv
import cv2
import os
import base64
import numpy as np
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .face_recognition_model import face_cascade, model,train_model

haar_file = 'haarcascade_frontalface_default.xml'

face_cascade = cv2.CascadeClassifier(haar_file)


@api_view(['GET'])
def test(req):
    return Response({'message':"TEst "})


# Face Dataset Creation
# .................................................................................................................................
# Directory where datasets will be stored
dataset_directory = os.path.join(settings.BASE_DIR, 'dataset')

# Path to student CSV file
student_csv_path = os.path.join(dataset_directory, 'student.csv')

# Function to ensure dataset directory exists
def ensure_dataset_directory():
    if not os.path.exists(dataset_directory):
        os.makedirs(dataset_directory)

# Function to ensure student CSV file exists
def ensure_student_csv():
    if not os.path.exists(student_csv_path):
        with open(student_csv_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Name', 'Roll Number', 'Classroom Name','Email'])

# Function to check if a student entry already exists in the CSV file
def student_exists_in_csv(name, roll_number, classroom_name,email):
    if not os.path.exists(student_csv_path):
        return False
    with open(student_csv_path, mode='r') as file:
        reader = csv.reader(file)
        for row in reader:
            if row == [name, roll_number, classroom_name, email]:
                return True
    return False

# Function to append student details to the CSV file if not already present
def append_student_to_csv(name, roll_number, classroom_name, email):
    if not student_exists_in_csv(name, roll_number, classroom_name, email):
        with open(student_csv_path, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([name, roll_number, classroom_name, email])

@api_view(['POST'])
def CreateDataset(request):
    if request.method == 'POST':
        try:
            # Retrieve data from POST request
            name = request.data.get('name')
            roll_number = request.data.get('roll_number')
            classroom_name = request.data.get('classroom_name')
            email = request.data.get('email')
            image_data = request.data.get('image')

            # Validate input data
            if not name or not roll_number or not classroom_name or not email or not image_data:
                return Response({'error': 'Name, Roll Number, Classroom Name, Email, or image data is missing or empty.'}, status=status.HTTP_400_BAD_REQUEST)

            # Trim any extra spaces from the Name and Classroom Name
            name = name.strip()
            classroom_name = classroom_name.strip()
            email = email.strip()

            # Decode the base64 image
            image_data = image_data.split(",")[1]
            image_bytes = base64.b64decode(image_data)
            image_np = np.frombuffer(image_bytes, dtype=np.uint8)
            image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

            # Convert image to grayscale
            gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # Ensure dataset directory and CSV file exist
            ensure_dataset_directory()
            ensure_student_csv()

            # Construct path for the classroom and user's dataset
            classroom_path = os.path.join(dataset_directory, classroom_name)
            user_dataset_path = os.path.join(classroom_path, name)

            # Create directory if it doesn't exist
            if not os.path.exists(classroom_path):
                os.makedirs(classroom_path)
                print(f"Created classroom directory for {classroom_name}")

            if not os.path.exists(user_dataset_path):
                os.makedirs(user_dataset_path)
                print(f"Created dataset directory for {name}")

            # Save the grayscale image
            total_images = len(os.listdir(user_dataset_path))
            image_path = os.path.join(user_dataset_path, f"{total_images:05}.png")
            cv2.imwrite(image_path, gray_image)

            total_images += 1

            # Append student details to CSV if not already present
            append_student_to_csv(name, roll_number, classroom_name, email)

            return Response({'message': f'Dataset creation complete for {name}', 'total_images': total_images}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error processing request:", str(e))  # Log the error for debugging
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
# ........................................................................................................................................
# Training and Recognition of Face

 # Retraining the model when Take attedance button is clicked
names={}
@api_view(['POST'])
def RetrainModel(request):
    global names
    classroom_name = request.data.get('classroom_name')
    if not classroom_name:
        return Response({'error': 'Classroom name is missing'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        names = train_model(classroom_name)
        print("Retrained successfully")
        print(names)
        return Response({'message': 'Model retrained successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error retraining model:", str(e))  # Log the error for debugging
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ..................................................................................................................................

# Face Recognition

# Function to fetch Roll Number and Email from student.csv
def get_student_details(name):
    if not os.path.exists(student_csv_path):
        return None, None
    
    try:
        with open(student_csv_path, mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Name'].strip() == name.strip():
                    return row['Roll Number'].strip(), row['Email'].strip()
        
        return None, None  # Return None if name not found in CSV
    
    except Exception as e:
        print(f"Error reading CSV: {str(e)}")
        return None, None

# Recognising Face
@api_view(['POST'])
def DetectFace(request):
    if request.method == 'POST':
        try:
            # Decode the base64 image
            image_data = request.data.get('image')
            image_data = image_data.split(",")[1]
            image_bytes = base64.b64decode(image_data)
            image_np = np.frombuffer(image_bytes, dtype=np.uint8)
            im = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

            gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)

            if len(faces) == 0:
                return Response({"name": "No face detected"}, status=status.HTTP_200_OK)

            if not names:  # Check if names array is empty
                return Response({"name": "Not a Student of this Class"}, status=status.HTTP_200_OK)

            for (x, y, w, h) in faces:
                face = gray[y:y + h, x:x + w]
                face_resize = cv2.resize(face, (130, 100))

                prediction = model.predict(face_resize)
                print(f"Prediction: {prediction}")
                print(prediction[1])
                print(prediction[0])

                if prediction[1] < 200:
                    name = names[prediction[0]]
                    print(f"Predicted Name: {name}")
                    roll_number, email = get_student_details(name)
                    print(f"Roll Number: {roll_number}, Email: {email}")
                    return Response({"name": name, "roll_number": roll_number, "email": email}, status=status.HTTP_200_OK)
                else:
                    print("Unknown face detected with high confidence.")
                    return Response({"name": "Not Student of this Class"}, status=status.HTTP_200_OK)

            return Response({"name": "No face detected"}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error processing request:", str(e))  # Log the error for debugging
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
