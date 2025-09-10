// controllers/software/softwareController.js
import Software from "../models/Software.js";

// 🔍 Search software with aggregation + keep field name as uploadedBy
export const searchSoftware = async (req, res) => {
  try {
    const { keywords = "", minPrice, maxPrice } = req.query;

    const matchStage = {};

    if (keywords) {
      matchStage.title = { $regex: keywords, $options: "i" };
    }

    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = Number(minPrice);
      if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }

    const softwares = await Software.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "uploadedBy",
          foreignField: "_id",
          as: "uploadedBy", // 👈 keep same field name
        },
      },
      {
        $unwind: {
          path: "$uploadedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          price: 1,
          version: 1,
          createdAt: 1,
          "uploadedBy._id": 1,
          "uploadedBy.displayName": 1,
          "uploadedBy.photoUrl": 1,
        },
      },
    ]);

    res.json(softwares);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Failed to search software" });
  }
};

// 📄 Get single software by ID + populate uploadedBy
export const getSoftware = async (req, res) => {
  try {
    const { id } = req.params;

    const softwareDoc = await Software.findById(id).populate(
      "uploadedBy",
      "displayName photoUrl"
    );

    if (!softwareDoc) {
      return res.status(404).json({ message: "Software not found" });
    }

    const software = softwareDoc.toObject();

    software.isCreator = false;
    if (
      req.user?.id &&
      software.uploadedBy &&
      req.user.id === software.uploadedBy._id.toString()
    ) {
      software.isCreator = true;
    }

    res.json(software);
  } catch (err) {
    console.error("Get software error:", err);
    res.status(500).json({ message: "Failed to fetch software" });
  }
};
