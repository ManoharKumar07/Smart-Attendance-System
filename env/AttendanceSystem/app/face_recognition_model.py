import cv2
import numpy as np
import os

datasets = 'dataset'
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
model = cv2.face.LBPHFaceRecognizer_create()

def train_model():
    print("Training model...")
    (images, labels, names, id) = ([], [], {}, 0)

    # Load the dataset
    for (subdirs, dirs, files) in os.walk(datasets):
        for subdir in dirs:
            names[id] = subdir
            subjectpath = os.path.join(datasets, subdir)
            for filename in os.listdir(subjectpath):
                path = subjectpath + '/' + filename
                label = id
                images.append(cv2.imread(path, 0))
                labels.append(int(label))
            id += 1

    (images, labels) = [np.array(lis) for lis in [images, labels]]
    model.train(images, labels)

    return names

# Train the model once at startup
names = train_model()
