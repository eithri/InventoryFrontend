export class Producto {
  constructor(
    public id: number | null = null,
    public name: string | null = null,
    public price: number | null = null,
    public stock: number | null = null
  ) {}
}
