import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVariant {
  name: string;
  value: string;
  additionalPrice?: number;
  stock?: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  stock: number;
  category: Types.ObjectId;
  images: string[];
  variants?: IVariant[];
  isActive: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
}

const VariantSchema = new Schema<IVariant>(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    additionalPrice: { type: Number, default: 0 },
    stock: { type: Number, min: 0, default: 0 }
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (this: IProduct, v: number) {
          return !v || v <= this.price;
        },
        message: 'Discount price must be less than or equal to price'
      }
    },
    sku: { type: String, unique: true, sparse: true, trim: true },
    stock: { type: Number, required: true, min: 0 },

    category: { type: Schema.Types.ObjectId, required: true },

    images: [{ type: String }],
    variants: [VariantSchema],
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

// Indexes
ProductSchema.index({ category: 1, name: 1 }, { unique: true });
ProductSchema.index({ tags: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
