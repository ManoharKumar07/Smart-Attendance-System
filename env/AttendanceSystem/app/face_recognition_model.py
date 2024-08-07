# face_recognition_model.py for training model
import cv2
import numpy as np
import os

datasets = 'dataset'
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
model = cv2.face.LBPHFaceRecognizer_create()
#model =  cv2.face.FisherFaceRecognizer_create()
def train_model(classroom_name):
    print(f"Training model for classroom: {classroom_name}...")
    (images, labels, names, id) = ([], [], {}, 0)

    # Load the dataset for the specific classroom
    classroom_path = os.path.join(datasets, classroom_name)
    for (subdirs, dirs, files) in os.walk(classroom_path):
        for subdir in dirs:
            names[id] = subdir
            subjectpath = os.path.join(classroom_path, subdir)
            for filename in os.listdir(subjectpath):
                path = subjectpath + '/' + filename
                label = id
                images.append(cv2.imread(path, 0))
                labels.append(int(label))
            id += 1

    (images, labels) = [np.array(lis) for lis in [images, labels]]
    print(images, labels)  
    model.train(images, labels)

    return names
