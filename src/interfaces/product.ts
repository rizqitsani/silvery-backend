export class CreateProductDto {
  name: string;
  price: number;
  description: string;
  stock: number;
  available: boolean;
}

export class UpdateProductDto {
  name: string;
  price: number;
  description: string;
  stock: number;
  available: boolean;
}
