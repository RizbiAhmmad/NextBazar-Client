export interface IAttributeValue {
  id: string;
  value: string;
  attributeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttribute {
  id: string;
  name: string;
  shopId?: string | null;
  values: IAttributeValue[];
  createdAt: string;
  updatedAt: string;
  shop?: {
    id: string;
    name: string;
  } | null;
}
