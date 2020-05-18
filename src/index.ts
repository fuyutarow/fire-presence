import http from 'http';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Context-type', 'text/plain');
  res.write('hello, world!');
  res.end();
});

server.listen(3000);
console.log('run');
