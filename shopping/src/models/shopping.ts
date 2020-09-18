import mongoose from 'mongoose';
import { ItemStatus } from '@familyapp/common';

export interface Item {
  name: string;
  qty: string;
  status: ItemStatus;
}

interface ShoppingAttr {
  name: string;
  creatorId: string;
  creatorName: string;
  items?: Item[];
}

interface ShoppingDoc extends mongoose.Document {
  name: string;
  creatorId: string;
  creatorName: string;
  items?: Item[];
}

interface ShoppingModel extends mongoose.Model<ShoppingDoc> {
  build(attr: ShoppingAttr): ShoppingDoc;
}

const shoppingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    items: {
      type: [{ name: String, qty: String, status: String }],
      default: [],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

shoppingSchema.statics.build = (attrs: ShoppingAttr) => new Shopping(attrs);

const Shopping = mongoose.model<ShoppingDoc, ShoppingModel>(
  'shopping',
  shoppingSchema
);

export { ItemStatus };

export default Shopping;
