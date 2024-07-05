from django.http import HttpResponse
from django.conf import settings
import cv2
import os
import numpy
import base64
import numpy as np
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .face_recognition_model import face_cascade, model, names,train_model

haar_file = 'haarcascade_frontalface_default.xml'

face_cascade = cv2.CascadeClassifier(haar_file)


# Face Dataset Creation
# .................................................................................................................................
# Directory where datasets will be stored
dataset_directory = os.path.join(settings.BASE_DIR, 'dataset')

# Function to ensure dataset directory exists
def ensure_dataset_directory():
    if not os.path.exists(dataset_directory):
        os.makedirs(dataset_directory)


@api_view(['POST'])
def CreateDataset(request):
    if request.method == 'POST':
        try:
            # Retrieve data from POST request
            Name = request.data.get('name')
            Roll_Number = request.data.get('roll_number')
            image_data = request.data.get('image')

            # Validate input data
            if not Name or not Roll_Number or not image_data:
                return Response({'error': 'Name, Roll Number, or image data is missing or empty.'}, status=status.HTTP_400_BAD_REQUEST)

            # Trim any extra spaces from the Name
            Name = Name.strip()

            # Decode the base64 image
            image_data = image_data.split(",")[1]
            image_bytes = base64.b64decode(image_data)
            image_np = np.frombuffer(image_bytes, dtype=np.uint8)
            image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

            # Convert image to grayscale
            gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # Ensure dataset directory exists
            ensure_dataset_directory()

            # Construct path for the user's dataset
            user_dataset_path = os.path.join(dataset_directory, Name)

            # Create directory if it doesn't exist
            if not os.path.exists(user_dataset_path):
                os.makedirs(user_dataset_path)
                print(f"Created dataset directory for {Name}")

            # Save the grayscale image
            total_images = len(os.listdir(user_dataset_path))
            image_path = os.path.join(user_dataset_path, f"{total_images:05}.png")
            cv2.imwrite(image_path, gray_image)

            total_images += 1

            return Response({'message': f'Dataset creation complete for {Name}', 'total_images': total_images}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error processing request:", str(e))  # Log the error for debugging
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# ........................................................................................................................................

 # Retraining the model when Take attedance button is clicked
names={}
@api_view(['POST'])
def RetrainModel(request):
    global names
    try:
        names = train_model()
        print("Retrained successfully")
        return Response({'message': 'Model retrained successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error retraining model:", str(e))  # Log the error for debugging
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# Face Recognition
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

            for (x, y, w, h) in faces:
                face = gray[y:y + h, x:x + w]
                face_resize = cv2.resize(face, (130, 100))

                prediction = model.predict(face_resize)
                if prediction[1] < 800:
                    name = names[prediction[0]]
                    return Response({"name": name}, status=status.HTTP_200_OK)
                else:
                    return Response({"name": "Unknown"}, status=status.HTTP_200_OK)

            return Response({"name": "No face detected"}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error processing request:", str(e))  # Log the error for debugging
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
#................................................................................................................

