import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));

// Function to generate random password
const generatePassword = (length, options) => {
  const charTypes = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    special: "!@#$%^&*()_+[]{}<>?",
  };

  let allChars = "";
  if (options.lowercase) allChars += charTypes.lowercase;
  if (options.uppercase) allChars += charTypes.uppercase;
  if (options.numbers) allChars += charTypes.numbers;
  if (options.special) allChars += charTypes.special;

  if (allChars.length === 0)
    return "Please select at least one character type.";

  let password = "";
  for (let i = 0; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password;
};

// API endpoint
app.post("/generate-password", (req, res) => {
  const { length, options } = req.body;

  if (length < 3) {
    return res
      .status(400)
      .json({ error: "Password length must be at least 3." });
  }

  const password = generatePassword(length, options);
  res.json({ password });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
