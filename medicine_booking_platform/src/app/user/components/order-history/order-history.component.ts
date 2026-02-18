import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/cart.model';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  orderStats = { total: 0, pending: 0, completed: 0 };
  loading = true;
  newOrderId: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.newOrderId = params['newOrder'] || null;
    });
    
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.loading = false;
    });

    this.orderService.getOrderStats().subscribe(stats => {
      this.orderStats = stats;
    });
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order. Please try again.');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'ready': 'status-ready',
      'picked-up': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || '';
  }

  navigateToMedicines(): void {
    this.router.navigate(['/user/medicines']);
  }
}