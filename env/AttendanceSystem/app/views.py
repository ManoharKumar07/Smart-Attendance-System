from django.http import HttpResponse
from django.conf import settings
import cv2
import imutils
import time
import csv
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status


# Path to the Haar Cascade XML file for face detection
cascade_path = os.path.join(settings.BASE_DIR, 'app', 'haarcascade_frontalface_default.xml')

# Ensure the Haar Cascade XML file exists
if not os.path.exists(cascade_path):
    raise FileNotFoundError(f"Haar Cascade XML file not found at path: {cascade_path}")

# Initialize the face detector
detector = cv2.CascadeClassifier(cascade_path)

# Check if the detector is initialized correctly
if detector.empty():
    raise IOError(f"Failed to load Haar Cascade XML file from path: {cascade_path}")

# Directory where datasets will be stored
dataset_directory = os.path.join(settings.BASE_DIR, 'dataset')

# Function to ensure dataset directory exists
def ensure_dataset_directory():
    if not os.path.exists(dataset_directory):
        os.makedirs(dataset_directory)

# Create your views here.
@api_view(['GET'])
def Attendance(request):
    student ={"name":"Manohar","rollno":24}
    return Response(student)


@api_view(['POST'])
def CreateDataset(request):
    if request.method == 'POST':
        # Retrieve data from POST request
        Name = request.data.get('name')
        Roll_Number = request.data.get('roll_number')

        if not Name:
            return Response({'error': 'Name or Roll Number parameter is missing or empty.'}, status=status.HTTP_400_BAD_REQUEST) 

        # Ensure dataset directory exists
        ensure_dataset_directory()

        # Construct path for the user's dataset
        user_dataset_path = os.path.join(dataset_directory, Name)

        # Create directory if it doesn't exist
        if not os.path.exists(user_dataset_path):
            os.makedirs(user_dataset_path)
            print(f"Created dataset directory for {Name}")

        # Store user info in CSV file
        info = [Name, Roll_Number]
        with open(os.path.join(settings.BASE_DIR, 'student.csv'), 'a') as csvFile:
            write = csv.writer(csvFile)
            write.writerow(info)

        # Start video stream for capturing images
        cam = cv2.VideoCapture(0)

        if not cam.isOpened():
            return HttpResponse("Failed to open camera.")

        time.sleep(2.0)
        total = 0

        while total < 50:
            print(f"Capturing image {total + 1}")
            _, frame = cam.read()
            img = imutils.resize(frame, width=400)
            rects = detector.detectMultiScale(
                cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), scaleFactor=1.1,
                minNeighbors=5, minSize=(30, 30))

            for (x, y, w, h) in rects:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                image_path = os.path.join(user_dataset_path, f"{total:05}.png")
                cv2.imwrite(image_path, img)
                total += 1

            cv2.imshow("Frame", frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                break

        cam.release()
        cv2.destroyAllWindows()

        return Response({'message': f'Dataset creation complete for {Name}'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Dataset Creation error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)