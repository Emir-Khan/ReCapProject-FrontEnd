export interface Rental {
  id:number
  userId: number;
  carId: number;
  carName: string;
  rentDate: Date;
  returnDate: Date;
}
