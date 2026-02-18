import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { MedicineService } from '../../services/medicine.service';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { Medicine } from '../../models/medicine.model';
import { User } from '../../../auth/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  featuredMedicines: Medicine[] = [];
  orderStats = { total: 0, pending: 0, completed: 0 };
  cartItemCount = 0;
  loading = true;

  quickActions = [
    {
      icon: 'bi-search',
      title: 'Browse Medicines',
      description: 'Search from thousands of medicines',
      route: '/user/medicines',
      color: 'primary'
    },
    {
      icon: 'bi-cart-check',
      title: 'My Cart',
      description: 'View your cart items',
      route: '/user/cart',
      color: 'accent'
    },
    {
      icon: 'bi-clock-history',
      title: 'Order History',
      description: 'Track your past orders',
      route: '/user/orders',
      color: 'secondary'
    }
  ];

  constructor(
    private authService: AuthService,
    private medicineService: MedicineService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Get current user
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    // Get featured medicines
    this.medicineService.getFeaturedMedicines().subscribe(medicines => {
      this.featuredMedicines = medicines;
      this.loading = false;
    });

    // Get order statistics
    this.orderService.getOrderStats().subscribe(stats => {
      this.orderStats = stats;
    });

    // Get cart count
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.totalItems;
    });
  }

  navigateToMedicines(): void {
    this.router.navigate(['/user/medicines']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/user/orders']);
  }

  navigateToCart(): void {
    this.router.navigate(['/user/cart']);
  }

  addToCart(medicine: Medicine): void {
    if (medicine.inStock) {
      this.cartService.addToCart(medicine, 1);
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
}