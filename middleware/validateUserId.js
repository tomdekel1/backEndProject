const { User } = require("../model/users");

module.exports = async (req, res, next) => {
  let requestingUser = await User.findById(req.user._id, ["isAdmin"]);
  console.log(requestingUser);
  if (
    (!requestingUser || requestingUser.isAdmin == false || null) &&
    req.params.id !== req.user._id
  ) {
    res.status(400).send("this action is allowed for the creating user only");
    return;
  }
  next();
};
