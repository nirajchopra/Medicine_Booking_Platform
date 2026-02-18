import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Order, BookingRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject: BehaviorSubject<Order[]>;
  public orders$: Observable<Order[]>;

  constructor() {
    const savedOrders = this.loadOrdersFromStorage();
    this.ordersSubject = new BehaviorSubject<Order[]>(savedOrders);
    this.orders$ = this.ordersSubject.asObservable();
  }

  private loadOrdersFromStorage(): Order[] {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      // Convert date strings back to Date objects
      return orders.map((order: any) => ({
        ...order,
        pickupDate: new Date(order.pickupDate),
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt)
      }));
    }
    return [];
  }

  private saveOrdersToStorage(orders: Order[]): void {
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp.slice(-6)}${random}`;
  }

  createOrder(bookingRequest: BookingRequest, userId: string): Observable<Order> {
    const newOrder: Order = {
      id: Date.now().toString(),
      userId,
      items: bookingRequest.items,
      subtotal: bookingRequest.items.reduce((sum, item) => {
        const price = item.medicine.discountPrice || item.medicine.price;
        return sum + (price * item.quantity);
      }, 0),
      discount: bookingRequest.items.reduce((sum, item) => {
        if (item.medicine.discountPrice) {
          return sum + ((item.medicine.price - item.medicine.discountPrice) * item.quantity);
        }
        return sum;
      }, 0),
      total: bookingRequest.items.reduce((sum, item) => {
        const price = item.medicine.discountPrice || item.medicine.price;
        return sum + (price * item.quantity);
      }, 0),
      status: 'pending',
      storeName: 'MediPlus Pharmacy',
      storeAddress: '123 Health Street, Medical District, Bhopal',
      pickupDate: bookingRequest.pickupDate,
      pickupTime: bookingRequest.pickupTime,
      createdAt: new Date(),
      updatedAt: new Date(),
      orderNumber: this.generateOrderNumber()
    };

    return of(newOrder).pipe(
      delay(1000),
      map(order => {
        const currentOrders = this.ordersSubject.value;
        const updatedOrders = [order, ...currentOrders];
        this.ordersSubject.next(updatedOrders);
        this.saveOrdersToStorage(updatedOrders);
        return order;
      })
    );
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getOrderById(orderId: string): Observable<Order | undefined> {
    const order = this.ordersSubject.value.find(o => o.id === orderId);
    return of(order).pipe(delay(300));
  }

  cancelOrder(orderId: string): Observable<boolean> {
    const currentOrders = this.ordersSubject.value;
    const updatedOrders = currentOrders.map(order =>
      order.id === orderId
        ? { ...order, status: 'cancelled' as const, updatedAt: new Date() }
        : order
    );
    
    return of(true).pipe(
      delay(500),
      map(() => {
        this.ordersSubject.next(updatedOrders);
        this.saveOrdersToStorage(updatedOrders);
        return true;
      })
    );
  }

  getOrderStats(): Observable<{ total: number; pending: number; completed: number }> {
    const orders = this.ordersSubject.value;
    return of({
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      completed: orders.filter(o => o.status === 'picked-up').length
    });
  }
}