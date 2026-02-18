import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Cart, CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], totalItems: 0, subtotal: 0, discount: 0, total: 0 };
  pickupDate: string = '';
  pickupTime: string = '';
  placingOrder = false;
  minDate: string = '';
  
  timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM'
  ];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    this.minDate = today.toISOString().split('T')[0];
    this.pickupDate = this.minDate;
    this.pickupTime = this.timeSlots[0];
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  updateQuantity(medicineId: string, change: number): void {
    const item = this.cart.items.find(i => i.medicine.id === medicineId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        this.cartService.updateQuantity(medicineId, newQuantity);
      }
    }
  }

  removeItem(medicineId: string): void {
    this.cartService.removeFromCart(medicineId);
  }

  placeOrder(): void {
    if (!this.pickupDate || !this.pickupTime) {
      alert('Please select pickup date and time');
      return;
    }

    if (this.cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.placingOrder = true;

    this.orderService.createOrder({
      items: this.cart.items,
      pickupDate: new Date(this.pickupDate),
      pickupTime: this.pickupTime
    }, currentUser.id!).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.placingOrder = false;
        this.router.navigate(['/user/orders'], {
          queryParams: { newOrder: order.id }
        });
      },
      error: (error) => {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
        this.placingOrder = false;
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/user/medicines']);
  }
}