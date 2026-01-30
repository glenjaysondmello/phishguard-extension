interface Comment {
  text?: string,
  createdAt: string,
}

export interface ReportItem {
  _id: string;
  url: string;
  host: string;
  pageTitle?: string;
  userComment?: string;
  userAgent?: string;
  fromExtension?: boolean;
  reportCount: number;
  reporterIds: string[];
  comments: Comment[];
  createdAt: string;
  status: string;
}