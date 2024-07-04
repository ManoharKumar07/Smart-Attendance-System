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

# Face Recognition
@api_view(['GET'])
def DetectFace(request):
    datasets = 'dataset'
    if  face_cascade:
        print("face cascade is Present")

    print('Training...')
    (images, labels, names, id) = ([], [], {}, 0)

    for (subdirs, dirs, files) in os.walk(datasets):
        for subdir in dirs:
            names[id] = subdir
            subjectpath = os.path.join(datasets, subdir)
            for filename in os.listdir(subjectpath):
                path = subjectpath + '/' + filename
                label = id
                images.append(cv2.imread(path, 0))
                labels.append(int(label))
            id +=1

    (images, labels) = [numpy.array(lis) for lis in [images, labels]]
    print(images, labels)                   
    (width, height) = (130, 100)
    model = cv2.face.LBPHFaceRecognizer_create()


    model.train(images, labels)

    # webcam = cv2.VideoCapture(2)
    webcam = cv2.VideoCapture(0)
    cnt=0

    while True:
        (_, im) = webcam.read()
        gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        for (x,y,w,h) in faces:
            cv2.rectangle(im,(x,y),(x+w,y+h),(255,255,0),2)
            face = gray[y:y + h, x:x + w]
            face_resize = cv2.resize(face, (width, height))

            prediction = model.predict(face_resize)
            cv2.rectangle(im, (x, y), (x + w, y + h), (0, 255, 0), 3)
            if prediction[1]<800:
                cv2.putText(im,'%s - %.0f' % (names[prediction[0]],prediction[1]),(x-10, y-10), cv2.FONT_HERSHEY_PLAIN,2,(0, 0, 255))
                print (names[prediction[0]])
                cnt=0
            else:
                cnt+=1
                cv2.putText(im,'Unknown',(x-10, y-10), cv2.FONT_HERSHEY_PLAIN,1,(0, 255, 0))
                if(cnt>100):
                    print("Unknown Person")
                    cv2.imwrite("unKnown.jpg",im)
                    cnt=0
        cv2.imshow('FaceRecognition', im)
        key = cv2.waitKey(10)
        if key == 27:
            break

    webcam.release()
    cv2.destroyAllWindows()
    
    return Response({"message":"Datect Face"})