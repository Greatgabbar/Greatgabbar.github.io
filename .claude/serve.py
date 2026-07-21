# Threaded static server (Python 2.7): avoids the hangs of SimpleHTTPServer
import sys, SimpleHTTPServer, SocketServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8710

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.0'          # no keep-alive stalls
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)
    def log_message(self, *a):
        pass

class Server(SocketServer.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

print('serving on %d' % PORT)
Server(('127.0.0.1', PORT), Handler).serve_forever()
