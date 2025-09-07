from wsgiref.simple_server import make_server

def application(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/html')])
    print(environ['PATH_INFO'])
    body = '<h1>Hello, {}</h1>'.format(environ['PATH_INFO'][1:] or 'web')
    return [body.encode('utf-8')]

httpd = make_server('', 8000, application)
print('Serving HTTP on prot 8000...')
httpd.serve_forever()

