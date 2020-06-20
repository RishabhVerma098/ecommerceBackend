const mongoose = require("mongoose");
const Slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title cannot be empty"],
      unique: true,
      trim: true,
      maxlength: [20, "lenght cannot be more than 20"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Description cannot be empty"],
      maxlength: [500, "length cannot be more than 500"],
    },
    platform: {
      type: [String],
      required: [true, "Platform cannot be empty"],
      enum: ["PS4", "XBOX", "PC"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    price: {
      type: Number,
      required: [true, "Price cannot be empty"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
      required: [true, "Photo cannot be empty"],
    },
    gameFile: {
      type: String,
      default: "no-game.jpg",
      required: [true, "Photo cannot be empty"],
      select: false,
    },
    offer: {
      type: Number,
      min: -1,
      max: 100,
    },
    genre: {
      //Array of strings
      type: [String],
      required: [true, "genre cannot be empty"],
      //Only available value
      enum: ["Action", "RPG", "FPS", "Horror", "Battle Royal", "Mystery"],
    },
    pegi: {
      type: String,
      required: true,
      required: [true, "Pegi cannot be empty"],
    },
    company: {
      //Array of strings
      type: [String],
      required: [true, "company cannot be empty"],
      //Only available value
      enum: [
        "Activision",
        "Respawn",
        "Rockstar Games",
        "Ubisoft",
        "Epic Games",
      ],
    },
    sold: {
      type: Number,
      default: 0,
    },
    video: {
      type: [String],
      required: [true, "video link cannot be empty"],
    },
    videoImage: {
      type: [String],
      required: [true, "video image cannot be empty"],
    },
  },
  {
    // Make Mongoose use Unix time (seconds since Jan 1, 1970)
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.slug = Slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Product", productSchema);
