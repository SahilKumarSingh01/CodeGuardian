import Software from "../../models/Software.js";
import Wishlist from "../../models/Wishlist.js";

// --- Already existing ---
export const getAllSoftware = async (req, res) => {
  try {
    const softwares = await Software.find().populate("uploadedBy", "displayName photoUrl");
    res.status(200).json(softwares);
    // console.log(software);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// --- Wishlist controllers ---
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate({
        path: "softwares",
        populate: { path: "uploadedBy", select: "displayName photoUrl" }
      });

    if (!wishlist) {
      return res.status(200).json([]);
    }
    res.status(200).json(wishlist.softwares);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const addToWishlist = async (req, res) => {
  try {
    const { id: softwareId } = req.params;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { softwares: softwareId } }, // avoids duplicates
      { new: true, upsert: true }
    ).populate({
      path: "softwares",
      populate: { path: "uploadedBy", select: "displayName photoUrl" },
    });

    res.status(200).json(wishlist.softwares);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const removeFromWishlist = async (req, res) => {
  try {
    const { id: softwareId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.softwares = wishlist.softwares.filter(
      (s) => s.toString() !== softwareId
    );
    await wishlist.save();

    const updated = await wishlist.populate({
      path: "softwares",
      populate: { path: "uploadedBy", select: "displayName photoUrl" }
    });

    res.status(200).json(updated.softwares);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
