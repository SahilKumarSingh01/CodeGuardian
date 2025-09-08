// controllers/software/softwareController.js
import Software from "../models/Software.js";

// 🔍 Search software with aggregation
export const searchSoftware = async (req, res) => {
  try {
    const { keywords = "", minPrice, maxPrice } = req.query;

    // Build match stage
    const matchStage = {};

    // Keyword search (partial match on title)
    if (keywords) {
      matchStage.title = { $regex: keywords, $options: "i" };
    }

    // Price filter
    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = Number(minPrice);
      if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }

    const softwares = await Software.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } }, // newest first
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          price: 1,
          version: 1,
          createdAt: 1,
        },
      },
    ]);
    console.log(keywords,);
    // console.log(softwares);
    res.json(softwares);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Failed to search software" });
  }
};
