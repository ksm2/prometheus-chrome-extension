import http from "node:http";
import prometheus from "prom-client";

prometheus.collectDefaultMetrics();

const server = http.createServer(async (req, res) => {
  const text = await prometheus.register.metrics();

  res.writeHead(200, { "Content-Type": prometheus.register.contentType });
  res.write(text);
  res.end();
});

server.listen(8080);
console.log("Server running at http://localhost:8080/");
