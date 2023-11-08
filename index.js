const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const http = require("http"); // HTTP 모듈 추가
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const testRouter = require("./test");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["https://localhost:3000", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE"],
  })
);

app.use(cookieParser("쿠키쿠키쿠키"));

app.use(morgan("dev"));

app.use('/test',testRouter)

// 라우터 연결
app.get("/", (req, res) => {
  res.send(`
    <a href="/test"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
  `);
});

const HTTP_PORT = process.env.SERVER_PORT || 8080; // Node.js 애플리케이션을 8080 포트에서 실행
let httpServer; // HTTP 서버 인스턴스

if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
  const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  // HTTPS로 실행
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(HTTP_PORT, () => {
    console.log("Node.js HTTPS 서버가 실행 중입니다.");
  });
} else {
  console.log("SSL 인증서 파일이 존재하지 않으므로 HTTP로 실행합니다.");

  // HTTP로 실행
  httpServer = http.createServer(app);
  httpServer.listen(HTTP_PORT, () => {
    console.log("Node.js HTTP 서버가 실행 중입니다.");
  });
}
module.exports = httpServer;
