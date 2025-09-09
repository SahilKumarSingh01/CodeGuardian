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



// 📄 Get single software by ID
export const getSoftware = async (req, res) => {
  try {
    const { id } = req.params;

    const softwareDoc = await Software.findById(id);

    if (!softwareDoc) {
      return res.status(404).json({ message: "Software not found" });
    }

    // convert to plain object to safely add custom fields
    const software = softwareDoc.toObject();

    software.isCreator = false;
    if (req.user?.id && req.user.id === software.uploadedBy.toString()) {
      software.isCreator = true;
    }
    // console.log(req.user);
    res.json(software);
  } catch (err) {
    console.error("Get software error:", err);
    res.status(500).json({ message: "Failed to fetch software" });
  }
};
