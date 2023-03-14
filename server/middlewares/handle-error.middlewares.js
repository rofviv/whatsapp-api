exports.handleError = (error, req, res, next) => {
  console.log("error", error);
  res.status(500).json({ message: error.message, status: "ERROR", path: req.path });
};
