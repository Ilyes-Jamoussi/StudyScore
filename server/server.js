const path = require("path");
const express = require("express");
const cors = require("cors");
const {requestLogger} = require("./middlewares/requestLogger");
const partnerRouter = require("./routes/partner");
const reviewRouter = require("./routes/review");
const logsRouter = require("./routes/logs");

const app = express();
const PORT = 5020;
const SIZE_LIMIT = "10mb";
const PUBLIC_PATH = path.join(__dirname);

app.use(cors({ origin: '*' }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.static(PUBLIC_PATH));

app.use(requestLogger);

app.use("/api/partner", partnerRouter.router);
app.use("/api/review",  reviewRouter.router);
app.use("/logs", logsRouter.router);

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = server;
