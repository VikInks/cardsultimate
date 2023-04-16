import tensorflow as tf

print("TensorFlow version: {}".format(tf.__version__))
print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))

# Afficher la configuration de l'appareil TensorFlow
tf.debugging.set_log_device_placement(True)

# Créer un tenseur et l'afficher
with tf.device('/CPU:0'):
    a = tf.constant([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], shape=[2, 3], name='a')
with tf.device('/GPU:0'):
    b = tf.constant([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], shape=[3, 2], name='b')
    c = tf.matmul(a, b)

print(c)
