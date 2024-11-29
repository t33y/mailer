import express, { Request, Response } from "express";
import { Resend } from "resend";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "*",
  "Access-Control-Allow-Origin": "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  "Access-Control-Allow-Headers": ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.post("/", async (req: Request, res: Response) => {
  try {
    const data = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["omotayoolarewaju@gmail.com"],
      subject: "Message From Contact Form",
      html: `<strong>${req.body.message}</strong>`,
      reply_to: req.body.email,
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/region", async (req: Request, res: Response) => {
  console.log("version", process.version);
  try {
    const response = await fetch(
      `http://www.geoplugin.net/extras/location.gp?lat=${req.body.lat}&lon=${req.body.lon}`
    );
    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch region" });
      return;
    }
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const region = await response.json();
      const countryCode = region.geoplugin_countryCode;

      res.status(200).json({ countryCode });
    } else {
      console.log("content type", contentType);
      console.log("response", response);
    }
  } catch (error) {
    console.log("error from fetch", error);
    res
      .status(500)
      .send({ error: "Internal Server Error", details: error.message });
  }
});

export default app;
