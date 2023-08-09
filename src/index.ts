import express, { Request, Response } from "express";
import mongoose from "mongoose"; /*mongoose is a library used to connect to the mongoDB*/
require("dotenv").config();
import cors from "cors";
import DeckModel from "./models/Deck";
import { createCardForDeckController } from "../controller/createCardForDeck";
import { getDeckController } from "../controller/getDeckController";
import { deleteCardOnDeckController } from "../controller/deleteCardOnDeckController";

const app = express();
/*
To run a .ts (typeScript) file you need a CLI (command-line tool)

npm i --save-dev ts-node

in the package.json, change the script to:
"dev": "ts-node src/index.ts"

You may face some error so just read through it. If it says to add @types/express, run the command accordingly

npm i --save-dev @types/express

Now, whenever you need to run the .ts file, in the terminal: npm run dev
this will trigger the dev in the script and run the ts-node and it will execute the index.ts present in the source folder

This is for the convenience

But you need to write this everytime you need to execute the file.
SO a solution is to install nodemon, which help restart the server whenever changes are made to the index.ts file.

npm install --save-dev nodemon

Go to the package.json and change the script to:
"dev": "nodemon --watch \"src/**\" --ext \"ts,json\" --exec \"ts-node src/index.ts\""

Once you run the script: npm run dev,
the nodemon will start the server and watch for any changes to the .ts or .json files in the src folder, and if any changes are there it will execute the ts-node to restart the server again and display the new changes

*/

app.use(cors());
app.use(express.json());

app.get("/decks", async (req: Request, res: Response) => {
  // To fetch all the decks from the database and send them to the client

  // Q1. How to fetch the decks from mongoDB?

  const decks = await DeckModel.find();
  // Q2. Ho do we send back the array to the UI?

  res.json(decks);
});

app.post("/decks", async (req: Request, res: Response) => {
  // Post the deck from the client to the database.

  console.log(req.body); //this is to check the req.body or the client input sent to the backend

  const newDeck = new DeckModel({
    title: req.body.title,
  }); // creates a new deck/note with the schema (already setup), using the data from the frontend
  const createdDeck = await newDeck.save(); // saves the data to the database
  res.json(createdDeck); //server response to the client with the created deck data
});

app.delete("/decks/:deckId", async (req: Request, res: Response) => {
  // 1. Get the ID from deck
  const deckID = req.params.deckId;

  // 2. Delete the deck from mongoDB
  const deletedDeck = await DeckModel.findByIdAndDelete(deckID);

  // 3. Send response to client
  res.json(deletedDeck);
});

app.post("/decks/:deckId/cards", createCardForDeckController);
app.get("/decks/:deckId", getDeckController);
app.delete("/decks/:deckId/cards/:index", deleteCardOnDeckController);

mongoose.connect(process.env.MONGO_URL!).then(() => {
  app.listen(3000, () => {
    console.log("server started at port: 3000");
  });
});

/*
We can separately run the mongoose.connect(url) and the app.listen()
But here we want to load the server only when we are successfully connected to our database
*/

// server created at port:3000
