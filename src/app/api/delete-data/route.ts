import { NextApiRequest, NextApiResponse } from "next";
import { deleteDataFromMemory } from "@/app/utils/memory-db"; // Update with the correct path to your function

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const result = await deleteDataFromMemory();
      if (result) {
        res.status(200).json({ message: "All data deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete data" });
      }
    } catch (error) {
      console.error("Error in delete-data API:", error);
      res
        .status(500)
        .json({ message: "Error deleting data from memory", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
