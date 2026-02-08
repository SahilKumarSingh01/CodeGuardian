import Software from "../../models/Software.js";
import Wishlist from "../../models/Wishlist.js";
import RefData from "../../models/RefData.js";
import cloudinary from "../../config/cloudinary.js";
// --- Already existing ---
// Get all RefData for current buyer
// Get all purchases for current buyer (only return software info)
export const getBuyerPurchases = async (req, res) => {
  try {
    const buyerId = req.user.id;

    // Fetch all RefData for this user and populate only software
    const refDatas = await RefData.find({ owner: buyerId })
      .populate("software", "title description version price demoVideo uploadedBy") // only software fields
      .lean();

    res.status(200).json(refDatas);
  } catch (err) {
    console.error("Error fetching buyer purchases:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// GET single purchase
export const getMyPurchaseById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const ref = await RefData.findOne({ _id: id, owner: userId })
      .populate({
        path: "software",
        populate: {
          path: "uploadedBy",
          select: "displayName photoUrl",
        },
      })
      .lean();
    if (!ref || !ref.software) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(ref);
  } catch (err) {
    console.error("getMyPurchaseById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE purchase
export const removePurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await RefData.findOneAndDelete({ _id: id, owner: userId });

    if (!deleted) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({ message: "Purchase removed successfully" });
  } catch (err) {
    console.error("removePurchase error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteDeviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { device } = req.query;  
    const userId = req.user.id;
    const fingerprint = decodeURIComponent(device);


    const result = await RefData.updateOne(
      { _id: id, owner: userId },
      { $pull: { devices:  fingerprint  } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Device not found" });
    }

    return res.status(200).json({ message: "Device deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

export const downloadSoftware = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { id } = req.params; // RefData._id

    // fetch refData with software
    const refData = await RefData.findOne({ _id: id, owner: buyerId })
      .populate("software")
      .lean();

    if (!refData || !refData.software) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const { publicId, title } = refData.software;
    const filename = `${title.replace(/\s+/g, "_")}.zip`;

    const signedUrl = cloudinary.utils.private_download_url(
      publicId,
      "zip",
      {
        resource_type: "raw",
        type: "authenticated",
        response_content_type: "application/zip",
        response_content_disposition: `attachment; filename="${filename}"`,
      }
    );

    return res.status(200).json({ url: signedUrl ,filename});
  } catch (error) {
    return res.status(500).json({ message: "Download failed" });
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
