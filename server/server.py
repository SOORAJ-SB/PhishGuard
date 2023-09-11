from flask import Flask, request
import pickle
import pandas as pd
import numpy as np
from urllib.parse import urlparse
from typing import List
import re

# Create an instance of the Flask class
app = Flask(__name__)

@app.route('/isUrlPhishy', methods=['POST'])
def isUrlPhishy():
    properties = request.data.decode('UTF-8')
    print(properties)
    print(len(properties))
    split_props = properties.split(',')
    print(split_props)
    print(len(split_props))
    tf = [list(map(int, split_props))]
    print(len(tf))
    testdata = np.array(tf)
    print(testdata)
    testdata = testdata.reshape(len(testdata), -1)
    #filename = '
    filename = 'model.pkl'
    train = pickle.load(open(filename, 'rb'))

    print(type(testdata[0]))
    predicted_class = train.predict(testdata)
    print("pre=", predicted_class)
    return str(predicted_class[0])

# Run the Flask application if the script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
