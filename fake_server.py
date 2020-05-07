# -*- coding: utf-8 -*-
import json
import http.server as server
from urllib.parse import urlparse, parse_qs


class MyHandler(server.SimpleHTTPRequestHandler):
    def do_POST(self):
        self.make_data()

    def do_GET(self):
        super().do_GET()

    def make_data(self):
        params = parse_qs(urlparse(self.path).query)
        content_len = int(self.headers.get("content-length", "0"))
        req_body = self.rfile.read(content_len).decode("utf-8")

        print("request body: " + req_body)
        response_status = self.validate_body(req_body)

        body_obj = {
            "method": str(self.command),
            "params": str(params),
            "body": req_body
        }
        body = json.dumps(body_obj).encode("utf-8")

        self.send_response(response_status)
        self.send_header('Content-type', '; charset=utf-8')
        self.send_header('Content-length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def validate_body(self,   body):
        # parse x-www-form-urlencoded values
        parsed = parse_qs(body)
        print(parsed)
        if parsed.get("pincode")[0] == "1234":
            return 200
        else:
            return 401


host = '127.0.0.1'
port = 8000
httpd = server.HTTPServer((host, port), MyHandler)
print('fake server is launched port:%s' % port)
httpd.serve_forever()
