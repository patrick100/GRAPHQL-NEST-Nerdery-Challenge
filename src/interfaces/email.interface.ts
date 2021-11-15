export interface Email {
  email: string;
  subject: string;
  body: string;
}

// TODO Merge interfaces
export interface EmailLowCost {
  to: string;
  from: string;
  templateId: string;
  dynamicTemplateData?: {
    imageURL: string;
    productName: string;
    productBrand: string;
  };
}
