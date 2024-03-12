const { default: mongoose } = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: true,
      enum: ["in", "out"],
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      requires: true,
    },
    email: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },

    //if inventory type is "out", then hospital will be set
    //if inventoryType is "in", then donar will be set

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "out";
      },
    },
    donar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "in";
      },
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventories", inventorySchema);

module.exports = Inventory;
