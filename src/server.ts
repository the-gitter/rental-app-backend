import express, { Request, Response, NextFunction, response } from "express";
import * as dotenv from "dotenv";
import expressApp from "./expressApp";
import { HttpError } from "http-errors";
import "dotenv/config";
import connectDB from "./utils/init_mongodb";
import MessageBrokerService from "./utils/message_broker/message_broker";
import authRouter from "./routes/authRoutes";
import SendApiResponse from "./utils/SendApiResponse";
dotenv.config();

const server = async () => {
  const app = express();

  //configs
  await connectDB();
  // const messageBroker = new MessageBrokerService("user");

  await expressApp(app);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    let messageToSend: {
      stack?: string | null;
      status: number;
      message: any;
    } = {
      stack: null,
      status: 500,
      message: "Internal Server Error",
    };
    console.log(messageToSend.message);
    if (err instanceof HttpError) {
      messageToSend.message = err.message;
      messageToSend.status = err.statusCode;
      if (process.env.NODE_ENV === "development") {
        messageToSend.stack = err.stack;
      }
    } else {
      console.error(err.stack || err.message);
    }

    if (process.env.NODE_ENV === "production" && !(err instanceof HttpError)) {
      messageToSend = { message: "Something broke", status: 500 };
    }

    const statusCode = messageToSend.status;

    if (process.env.NODE_ENV === "development")
      console.log(messageToSend.stack);

    // Respond with HTML
    // if (req.accepts("html")) {
    //   res.send(
    //     `<html><head><title>${statusCode} </title></head>
    //    <body><h1>${statusCode} </h1>
    //    ${messageToSend.message}<br/><br/>
    //    ${messageToSend.stack ? `<pre>${messageToSend.stack}</pre>` : ""}
    //    </body></html>`
    //   );
    //   return;
    // }

    // Respond with JSON
    // if (req.accepts("json")) {
    //   return;
    // }

    // Default to plain-text

    return SendApiResponse(res, statusCode, null, messageToSend.message);
  });

  app.listen(process.env.PORT, () => {
    console.log("listening at port ", process.env.PORT);
  });
};

server();
