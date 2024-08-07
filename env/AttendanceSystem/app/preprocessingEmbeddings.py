from imutils import paths
import numpy as np
import imutils
import pickle
import cv2
import os

# Initialize paths and filenames
dataset = "dataset/6th sem"
embeddingFile = "output/embeddings.pickle"
embeddingModel = "openface_nn4.small2.v1.t7"
prototxt = "model/deploy.prototxt"
model = "model/res10_300x300_ssd_iter_140000.caffemodel"

# Load models
detector = cv2.dnn.readNetFromCaffe(prototxt, model)
embedder = cv2.dnn.readNetFromTorch(embeddingModel)
imagePaths = list(paths.list_images(dataset))

def embedding():
    knownEmbeddings = []
    knownNames = []
    total = 0
    conf = 0.5

    for (i, imagePath) in enumerate(imagePaths):
        print(f"Processing image {i + 1}/{len(imagePaths)}")
        name = imagePath.split(os.path.sep)[-2]
        image = cv2.imread(imagePath)
        image = imutils.resize(image, width=600)
        (h, w) = image.shape[:2]
        
        imageBlob = cv2.dnn.blobFromImage(
            cv2.resize(image, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0), swapRB=False, crop=False
        )
        detector.setInput(imageBlob)
        detections = detector.forward()

        if len(detections) > 0:
            i = np.argmax(detections[0, 0, :, 2])
            confidence = detections[0, 0, i, 2]

            if confidence > conf:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                face = image[startY:endY, startX:endX]
                (fH, fW) = face.shape[:2]

                if fW < 20 or fH < 20:
                    continue
                
                faceBlob = cv2.dnn.blobFromImage(face, 1.0 / 255, (96, 96), (0, 0, 0), swapRB=True, crop=False)
                embedder.setInput(faceBlob)
                vec = embedder.forward()
                knownNames.append(name)
                knownEmbeddings.append(vec.flatten())
                total += 1

    print(f"Embedding: {total}")
    data = {"embeddings": knownEmbeddings, "names": knownNames}
    with open(embeddingFile, "wb") as f:
        f.write(pickle.dumps(data))
    print("Process Completed")
