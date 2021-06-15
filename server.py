
from http.server import HTTPServer, CGIHTTPRequestHandler

from os import curdir, sep

import json

# from server.localData import pathProcess, dataProcess


PORT_NUMBER = 8081


class myHandler(CGIHTTPRequestHandler):
	
	#Handler for the GET requests
	def do_GET(self):
		print(self.path)
		if self.path=="/":
			self.path = "/index.html"
		elif self.path == '/analyser':
			self.path = '/index.html'
		elif self.path == '/graphViewer':
			self.path = '/graphViewer.html'
		try:
			sendReply = False
			if self.path.endswith(".html"):
				mimetype='text/html'
				sendReply = True
			elif self.path.endswith(".jpg"):
				mimetype='image/jpg'
				sendReply = True
			elif self.path.endswith(".png"):
				mimetype='image/png'
				sendReply = True
			elif self.path.endswith(".gif"):
				mimetype='image/gif'
				sendReply = True
			elif self.path.endswith(".js"):
				mimetype='application/javascript'
				sendReply = True
			elif self.path.endswith(".css"):
				mimetype='text/css'
				sendReply = True
			elif self.path.endswith(".eot"):
				mimetype = 'application/vnd.ms-fontobject'
				sendReply = True
			elif self.path.endswith(".otf"):
				mimetype = 'application/font-sfnt'
				sendReply = True
			elif self.path.endswith(".svg"):
				mimetype = 'image/svg+xml'
				sendReply = True
			elif self.path.endswith(".ttf"):
				mimetype = 'application/font-sfnt'
				sendReply = True
			elif self.path.endswith(".woff"):
				mimetype = 'application/font-woff'
				sendReply = True
			elif self.path.endswith(".woff2"):
				mimetype = 'application/font-woff2'
				sendReply = True
			elif self.path.endswith(".ico"):
				mimetype = 'image/x-icon'
				sendReply = True
			if sendReply == True:
				#Open the static file requested and send it
				f = open(curdir + "/client" + self.path, 'rb')
				self.send_response(200)
				self.send_header('Content-type', mimetype)
				self.end_headers()
				# print(f.read())
				# print(type(f.read()))
				self.wfile.write(f.read())
				f.close()
			return

		except IOError:
			self.send_error(404,'File Not Found: %s' % self.path)

	#Handler for the POST requests
	def do_POST(self):
		try:
			pck = pathProcess()
			if not pck.checkPath(self.path):
				self.send_error(404, "No exits such path.")
			elif self.path == '/gflist' or self.path == '/skglist' or self.path == '/csvfile':
				dp = dataProcess()
				re = dp.getData(self.path, '')
				self.send_response(200)
				self.end_headers()
				self.wfile.write(json.dumps(re['data']))
			
			else:
				contentType = self.headers.getheader("Content-type")
				ctype, pdict = cgi.parse_header(contentType)
				length = int(self.headers.getheader('content-length'))
				data = self.rfile.read(length)
				if ctype == "application/json":
					dp = dataProcess()
					re = dp.getData(self.path, data)
					if re == 'empty':
						self.send_error(404, "No data found.")
					else:
						self.send_response(200)
						# self.send_header('Content-type', 'application/json')
						self.end_headers()
						try:
							self.wfile.write(json.dumps(re))
						except:
							self.wfile.write('no data')
					try:
						re.clear()
					except:
						print('canot clear temp memory')
				else:
					self.send_error(404, "No data found.")
				
		except Exception as inst:
			print(inst)
			self.send_error(404, "No data found.")
			


if __name__ == "__main__":
	try:
		#Create a web server and define the handler to manage the
		#incoming request
		server = HTTPServer(('', PORT_NUMBER), myHandler)
		print('Started httpserver on port ' , PORT_NUMBER)
		
		#Wait forever for incoming htto requests
		server.serve_forever()

	except KeyboardInterrupt:
		print('^C received, shutting down the web server')
		server.socket.close()




	
