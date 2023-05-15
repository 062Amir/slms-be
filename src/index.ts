import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import express, { Express } from "express";
import routes from "./routes/routes";
import cors from "cors";
import { dbConnect } from "./services/db.service";

const app: Express = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use("/", routes);

dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT} port`);
  });
});
