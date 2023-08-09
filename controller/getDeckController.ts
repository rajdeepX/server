import { Request, Response } from "express";
import DeckModel from "../src/models/Deck";

export async function getDeckController(req: Request, res: Response) {
  const { deckId } = req.params;
  const deck = await DeckModel.findById(deckId);
  res.json(deck);
}
