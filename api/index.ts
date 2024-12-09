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
  console.log("body", req.body);
  console.log("lon", req.body.lon);
  console.log("lat", req.body.lat);
  try {
    const response = await fetch(
      `http://www.geoplugin.net/extras/location.gp?lat=${req.body.lat}&lon=${req.body.lon}&format=json`
    );
    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch region" });
      return;
    }
    let data: any;
    const contentType = response.headers.get("Content-Type");
    console.log("content type", contentType);
    console.log("response", response);
    if (contentType?.includes("application/json")) {
      data = await response.json();
      console.log("it is JSON");
    } else if (contentType?.includes("text/plain")) {
      const text = await response.text();
      console.log("it is text");
      data = JSON.parse(text); // Parse plain text into JSON
    } else {
      throw new Error("Unexpected response format from GeoPlugin");
    }
    // if (contentType && contentType.indexOf("application/json") !== -1) {
    // const region = await response.json();
    const countryCode = data?.geoplugin_countryCode;

    res.status(200).json({ countryCode });
    // } else {
    // console.log("content type", contentType);
    // console.log("response", response);
    // res.status(300).send(response);
    // }
  } catch (error) {
    console.log("error from fetch", error);
    res
      .status(500)
      .send({ error: "Internal Server Error", details: error.message });
  }
});

export default app;
