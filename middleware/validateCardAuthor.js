const { Card } = require("../model/cards");
const { User } = require("../model/users");

module.exports = async (req, res, next) => {
  let card = await Card.findById(req.params.id);
  console.log(card);
  if (!card) {
    res.status(404).send("card not found");
    return;
  }
  let requestingUser = await User.findById(req.user._id, ["isAdmin"]);
  console.log(requestingUser);
  console.log(card.user_id);
  if (requestingUser.isAdmin == false && card.user_id != req.user._id) {
    res.status(400).send("this action is allowed for the creating user only");
    return;
  }
  next();
};
