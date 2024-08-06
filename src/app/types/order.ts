export default interface Order{
    id?: string;
    orderNo:string;
    productId:string;
    qty:number | null;
    salesPrice:number | null;
    discount:number | null;
    totalAmount:number | null;
}