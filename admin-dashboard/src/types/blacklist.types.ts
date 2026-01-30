export interface BlacklistItem {
  _id: string;
  domain: string;
  reason: string;
  addedBy?: string;
  createdAt: string;
  updatedAt: string;
}