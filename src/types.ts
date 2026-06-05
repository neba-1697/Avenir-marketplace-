/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'am' | 'om';

export type Role =
  | 'Buyer'
  | 'Seller'
  | 'Service_Provider'
  | 'Property_Owner'
  | 'Delivery_Agent'
  | 'Quality_Inspector'
  | 'Admin'
  | 'Super_Admin';

export type VerificationStatus =
  | 'Pending'
  | 'Under_Review'
  | 'Approved'
  | 'Rejected'
  | 'Suspended';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  ownerId: string;
  reviewsCount: number;
  rating: number;
  totalSales: number;
  followersCount: number;
  location: string;
  verified: boolean;
  categories: string[];
  returnPolicy: string;
  deliveryInfo: string;
}

export type ItemType = 'product' | 'service' | 'property';

export interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  videoUrl?: string;
  rating: number;
  reviewsCount: number;
  totalSales: number;
  verified: boolean;
  status: 'Active' | 'Inactive';
}

export interface Service {
  id: string;
  storeId: string;
  name: string;
  providerName: string;
  price: number;
  chargeType: 'hourly' | 'fixed';
  description: string;
  category: string;
  image: string;
  videoUrl?: string;
  location: string;
  rating: number;
  reviewsCount: number;
  contactThroughPlatformOnly: boolean;
}

export interface Property {
  id: string;
  storeId: string;
  title: string;
  price: number;
  listingType: 'rent' | 'buy';
  propertyType: 'house' | 'apartment' | 'commercial' | 'land' | 'warehouse' | 'office';
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqM?: number;
  image: string;
  videoUrl?: string;
  location: string;
  contactThroughPlatformOnly: boolean;
  verified: boolean;
}

export interface VideoListing {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  likes: number;
  views: number;
  productTags: {
    itemId: string;
    itemType: ItemType;
    name: string;
    price: number;
  }[];
}

export interface OrderItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: ItemType;
}

export type OrderStatus =
  | 'Order Received'
  | 'Seller Confirmed'
  | 'Awaiting Inspection'
  | 'Inspection Approved'
  | 'Ready For Pickup'
  | 'Picked Up'
  | 'In Transit'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Buyer Confirmed';

export interface TrackingHistoryItem {
  status: OrderStatus;
  time: string;
  note: string;
}

export interface InspectionReport {
  inspectorName: string;
  passed: boolean;
  comment: string;
  date: string;
}

export interface PaymentDetails {
  provider: 'Telebirr' | 'Chapa' | 'Bank Transfer';
  transactionId: string;
  status: 'escrow' | 'released' | 'refunded';
  amount: number;
  date: string;
}

export interface Order {
  id: string;
  buyerId: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  totalAmount: number;
  tax: number;
  commission: number;
  shippingAddress: string;
  recipientPhone: string;
  status: OrderStatus;
  trackingProgress: number;
  trackingLocation?: {
    lat: number;
    lng: number;
    name: string;
  };
  inspectionReport?: InspectionReport;
  trackingHistory: TrackingHistoryItem[];
  payment: PaymentDetails;
}

export interface SellerOnboardingDoc {
  id: string;
  ownerId: string;
  businessName: string;
  category: ItemType;
  ownerName: string;
  phone: string;
  idNumber: string;
  documentUrl: string;
  status: VerificationStatus;
  timestamp: string;
}

export interface SupportMessage {
  senderName: string;
  message: string;
  time: string;
  isFromStaff: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'resolved' | 'closed';
  messages: SupportMessage[];
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  time: string;
}
