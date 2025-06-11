import { Request, Response } from 'express';

export const sampleController = (_req: Request, res: Response) => {
  res.json({ message: 'Sample controller working ✅' });
};
