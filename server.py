import http.server
import socketserver
import webbrowser
import threading
import sys
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def open_browser():
    webbrowser.open_url = f"http://localhost:{PORT}"
    print(f"Server launched at: http://localhost:{PORT}")
    webbrowser.open(webbrowser.open_url)

if __name__ == '__main__':
    # Ensure current directory is served
    os.chdir(DIRECTORY)
    
    # Allow port reuse to prevent address-already-in-use errors on restarts
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Serving CausalChurn static dashboard from: {DIRECTORY}")
        print(f"Listening on port {PORT}...")
        
        # Open the user's default browser after a 1-second delay
        timer = threading.Timer(1.0, open_browser)
        timer.start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped successfully.")
            sys.exit(0)
