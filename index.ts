import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import express, { Express } from "express";
import routes from "./src/routes/routes";
import cors from "cors";
import { dbConnect } from "./src/services/db.service";
import { errorHandler, notFound } from "./src/middleware/error.middleware";

const app: Express = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use("/", routes);
app.use(notFound);
app.use(errorHandler);

dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT} port`);
  });
});
