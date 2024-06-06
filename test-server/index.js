import http from "node:http";
import prometheus from "prom-client";

prometheus.collectDefaultMetrics();

const h = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Example of a histogram",
  labelNames: ["code"],
  buckets: [0.1, 0.2, 0.3, 0.4, 0.5],
});

h.labels({ code: "200" }).observe(0.1);
h.labels({ code: "200" }).observe(0.15);
h.labels({ code: "200" }).observe(0.42);
h.labels({ code: "200" }).observe(0.6);
h.labels({ code: "200" }).observe(0.81);

const s = new prometheus.Summary({
  name: "http_request_summary_seconds",
  help: "Example of a summary",
  labelNames: ["code"],
});
s.labels({ code: "200" }).observe(0.1);
s.labels({ code: "200" }).observe(0.2);
s.labels({ code: "200" }).observe(0.5);
s.labels({ code: "200" }).observe(0.3);
s.labels({ code: "200" }).observe(0.4);
s.labels({ code: "200" }).observe(0.42);
s.labels({ code: "200" }).observe(0.46);
s.labels({ code: "200" }).observe(0.31);

const server = http.createServer(async (req, res) => {
  const text = await prometheus.register.metrics();

  res.writeHead(200, { "Content-Type": prometheus.register.contentType });
  res.write(text);
  res.end();
});

server.listen(8080);
console.log("Server running at http://localhost:8080/");
