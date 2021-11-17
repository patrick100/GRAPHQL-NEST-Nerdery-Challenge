export interface Email {
  to: string;
  from: string;
  templateId: string;
  dynamicTemplateData: {
    imageURL?: string;
    productName?: string;
    productBrand?: string;
    subject?: string;
    body?: string;
  };
}
