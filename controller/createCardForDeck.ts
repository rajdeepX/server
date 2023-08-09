import { Request, Response } from "express";
import DeckModel from "../src/models/Deck";

export async function createCardForDeckController(req: Request, res: Response) {
  const deckId = req.params.deckId;

  const deck = await DeckModel.findById(deckId);

  if (!deck) return res.status(400).send("No deck exists");
  const { text } = req.body;
  deck.cards.push(text);
  await deck.save();
  res.json(deck);
}
