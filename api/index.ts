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

export default app;

app.listen(3001, () => {
  console.log("Listening on http://localhost:3001");
});
