import { Request, Response } from "express";
import { IdentifyService } from "../services/identifyService";

export class IdentifyController {
  private identifyService: IdentifyService;

  constructor() {
    this.identifyService = new IdentifyService();
  }

  identify = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, phoneNumber } = req.body;

      if (!email && !phoneNumber) {
        res
          .status(400)
          .json({ error: "Either email or phoneNumber is required" });
        return;
      }

      const result = await this.identifyService.identify({
        email,
        phoneNumber,
      });
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in identify controller:", error);
      res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    }
  };
}
