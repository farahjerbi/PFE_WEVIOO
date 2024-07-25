# Use the pre-built TensorFlow image as a base
FROM tensorflow/tensorflow:2.16.2

# Set the working directory
WORKDIR /usr/src/app

# Copy the requirements file into the container
COPY requirements.txt ./

# Update pip to the latest version
RUN pip install --upgrade pip

# Force reinstall blinker to avoid conflicts
RUN pip install --ignore-installed blinker

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

# Install SpaCy model
RUN python -m spacy download en_core_web_md

# Output installed packages and versions
RUN pip freeze

# Copy the rest of the application code
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV NAME World

# Run the application
CMD ["python", "searchEngine.py"]

