import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, BatchNormalization, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ReduceLROnPlateau


def add_noise(image):
    noise = np.random.normal(0, 0.007, image.shape)
    noisy_image = np.clip(image + noise, 0, 1)
    return noisy_image


def combine_generators(gen1, gen2):
    while True:
        data1 = next(gen1)
        data2 = next(gen2)
        yield np.vstack((data1[0], data2[0])), np.vstack((data1[1], data2[1]))


# Dimensions des images d'entrée
img_width, img_height = 224, 224

# Autres paramètres du modèle
batch_size = 32
epochs = 2
num_classes = 10

# Dossiers contenant les données d'entraînement et de validation
train_dir = os.path.join("data", "train_dir")
val_dir = os.path.join("data", "test_dir")

# Importer le modèle si le fichier existe
model_path = "model.h5"
if os.path.isfile(model_path):
    model = tf.keras.models.load_model(model_path)
    os.system('clear')
    print("Le modèle a été importé avec succès...")
else:
    # Définir le modèle
    base_model = ResNet50(weights="imagenet", include_top=False, input_shape=(img_width, img_height, 3))
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation="relu", kernel_regularizer=tf.keras.regularizers.l1_l2(l1=0.001, l2=0.001))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    x = Dense(512, activation="relu", kernel_regularizer=tf.keras.regularizers.l1_l2(l1=0.001, l2=0.001))(x)
    output_layer = Dense(num_classes, activation="softmax")(x)

    model = tf.keras.Model(inputs=base_model.input, outputs=output_layer)
    model.compile(optimizer=Adam(lr=0.0001), loss="categorical_crossentropy", metrics=["accuracy"])

train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    shear_range=0.2,
    zoom_range=0.2,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
)

train_datagen_noisy = ImageDataGenerator(
    rescale=1.0 / 255,
    shear_range=0.2,
    zoom_range=0.2,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    preprocessing_function=add_noise
)

val_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_data = train_datagen.flow_from_directory(
    train_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size // 2,
    class_mode="categorical",
)

train_data_noisy = train_datagen_noisy.flow_from_directory(
    train_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size // 2,
    class_mode="categorical",
)

train_data_combined = combine_generators(train_data, train_data_noisy)

val_data = val_datagen.flow_from_directory(
    val_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode="categorical",
)

# Ajouter une régularisation L2 et une baisse de LR sur plateau
reduceLR = ReduceLROnPlateau(monitor='val_loss', factor=0.1, patience=3, verbose=1, min_lr=0.00001)
l1_l2_reg = tf.keras.regularizers.l1_l2(l1=0.001, l2=0.001)

for layer in model.layers:
    if isinstance(layer, tf.keras.layers.Conv2D):
        layer.kernel_regularizer = l1_l2_reg

# Entraîner le modèle tout en tenant compte des callbacks
model.fit(
    train_data_combined,
    epochs=epochs,
    validation_data=val_data,
    steps_per_epoch=len(train_data) * 2,
    callbacks=[reduceLR]
)

# Enregistrer le modèle
model.save(model_path)
print("Le modèle a été entraîné et sauvegardé avec succès...")
