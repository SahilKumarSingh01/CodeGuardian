// controllers/software/buyerController.js
import Software from "../../models/Software.js";

export const getAllSoftware = async (req, res) => {
  try {
    const software = await Software.find().populate("uploadedBy", "username email");
    res.json(software);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// later we can add purchase/download logic here
