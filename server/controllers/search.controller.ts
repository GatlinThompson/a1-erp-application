import { type Request, type Response } from "express";
import searchService from "@services/search.services.js";

const searchController = {
  /**
   * Retrieves products, shipping orders, etc.. based on a search query.
   * @param req The request object containing the search query.
   * @param res The response object used to send back the search results.
   */
  searchQuery: async (req: Request, res: Response) => {
    const { query } = req.query as { query: string };

    try {
      const result = await searchService.searchQuery(query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default searchController;
