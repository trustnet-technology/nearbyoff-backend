

const mongoose= require("mongoose");

Schema=mongoose.Schema;
const VendorSchema = new Schema({
  vendor_id: {
    type: String,
    unique: true,

  },
  user_id: {
    type: String,

  },
  contact_no: {
    type: Number,

  },
  shop_name: {
    type: String,
    default: "",
  },

  shop_desc: {
    type: String,
    default: "",
  },
  Address: {
    Address1: {
      type: String,
    },
    Address2: {
      type: String,
    },
    Address3: {
      type: String},

  },
  vendor_name: {
    type: String,
  },

  operating_hrs: {
    closing_time: {
      type: String,
    },
    opening_time: {
      type: String,
    },
  },
  category: {
    type: String,
  },
  category_images: {
    type: [String],
    default: "",

  },
  business_type: {
    type: String,
    default: "",
  },
  products: {
    type: [String],
    default: [],
  },
  shop_images: {
    type: [String],
    default: [],
  },
});


const Vendor = mongoose.model("Vendor", VendorSchema);
exports.Vendor =Vendor;
exports.VendorSchema = VendorSchema;
