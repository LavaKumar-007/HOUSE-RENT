const SavedSearch = require("../models/SavedSearch");

const createSavedSearch = async (req, res) => {
  try {
    const { name, filters } = req.body;

    const saved = await SavedSearch.create({
      user: req.user.id,
      name,
      filters,
    });

    res.status(201).json({
      success: true,
      message: "Search saved",
      savedSearch: saved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to save search" });
  }
};

const getSavedSearches = async (req, res) => {
  try {
    const searches = await SavedSearch.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: searches.length,
      savedSearches: searches,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch searches" });
  }
};

const deleteSavedSearch = async (req, res) => {
  try {
    await SavedSearch.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.status(200).json({ success: true, message: "Search deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete search" });
  }
};

module.exports = { createSavedSearch, getSavedSearches, deleteSavedSearch };
