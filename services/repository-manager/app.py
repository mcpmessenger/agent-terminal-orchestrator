import os
import subprocess
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/health')
def health():
    return jsonify(status='healthy', service='repository-manager')

@app.route('/spawn', methods=['POST'])
def spawn():
    data = request.get_json()
    terminal_id = data.get('terminalId', 'unknown')
    container_name = f"term-{terminal_id}"
    try:
        logging.info(f"[SPAWN] Attempting to launch container: {container_name}")
        # Launch a new Docker container in detached mode
        result = subprocess.run([
            "docker", "run", "-d", "--rm",
            "--name", container_name,
            "-v", f"{os.getcwd()}:/workspace",
            "ubuntu:latest", "bash", "-c", "while true; do sleep 60; done"
        ], check=True, capture_output=True, text=True)
        logging.info(f"[SPAWN] Container launched: {container_name}, Docker output: {result.stdout.strip()}")
        return jsonify(containerId=container_name, status='launched', dockerOutput=result.stdout.strip())
    except subprocess.CalledProcessError as e:
        logging.error(f"[SPAWN] Docker error: {e.stderr}")
        return jsonify(error=str(e), stderr=e.stderr, status='error'), 500
    except Exception as e:
        logging.error(f"[SPAWN] General error: {str(e)}")
        return jsonify(error=str(e), status='error'), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)