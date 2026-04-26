const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const portfolioItemSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  buyPrice: { type: Number, required: true, min: 0 },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    portfolio: [portfolioItemSchema],
    watchlist: [
      {
        coinId: String,
        name: String,
        symbol: String,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);
