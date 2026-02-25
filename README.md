# Medicine_Booking_Platform

# Medicine Booking Platform - Complete Structure Guide
## Store Dashboard + Admin Dashboard + Shared Components

## 📂 COMPLETE FOLDER STRUCTURE

```
medicine-booking-platform/
├── src/app/
│   │
│   ├── 📁 auth/                           ✅ COMPLETED
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   │
│   ├── 📁 user/                           ✅ COMPLETED
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── dashboard/
│   │   │   ├── medicine-list/
│   │   │   ├── cart/
│   │   │   └── order-history/
│   │   ├── services/
│   │   └── models/
│   │
│   ├── 📁 store/                          ⚠️ TO CREATE
│   │   ├── components/
│   │   │   ├── store-navbar/             → Store navigation
│   │   │   ├── store-dashboard/          → Stats & overview
│   │   │   ├── add-medicine/             → Add medicine form
│   │   │   ├── medicine-list/            → Manage medicines table
│   │   │   ├── update-stock/             → Stock management
│   │   │   └── store-orders/             → Orders management
│   │   ├── services/
│   │   │   └── store.service.ts          ✅ CREATED (mock data)
│   │   ├── models/
│   │   │   └── store.model.ts            ✅ CREATED
│   │   ├── store.module.ts
│   │   └── store-routing.module.ts
│   │
│   ├── 📁 admin/                          ⚠️ TO CREATE
│   │   ├── components/
│   │   │   ├── admin-navbar/             → Admin navigation
│   │   │   ├── admin-dashboard/          → Platform stats
│   │   │   ├── users-management/         → Users list & actions
│   │   │   ├── stores-management/        → Stores approval
│   │   │   └── admin-orders/             → All orders view
│   │   ├── services/
│   │   │   └── admin.service.ts          → Admin CRUD operations
│   │   ├── models/
│   │   │   └── admin.model.ts            → Admin data models
│   │   ├── admin.module.ts
│   │   └── admin-routing.module.ts
│   │
│   └── 📁 shared/                         ⚠️ TO CREATE
│       ├── components/
│       │   ├── footer/                    → Global footer
│       │   ├── sidebar/                   → Dashboard sidebar
│       │   ├── medicine-card/             → Reusable medicine card
│       │   └── order-table/               → Reusable order table
│       ├── services/
│       │   └── mock-data.service.ts       → Centralized mock data
│       ├── models/
│       │   └── shared.model.ts            → Common interfaces
│       └── shared.module.ts
│
├── backend/                                ⚠️ DATABASE INTEGRATION
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js                ✅ MySQL configuration
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json                       ✅ CREATED
│   └── .env.example                       ✅ CREATED
│
└── README.md
```

---

## 🎯 IMPLEMENTATION PLAN

### Phase 1: Store Dashboard (4 Components)
### Phase 2: Admin Dashboard (4 Components)  
### Phase 3: Shared Components (4 Components)
### Phase 4: Database Integration

---

## 📊 STORE DASHBOARD MODULE

### Routes Structure
```
/store
├── /dashboard          → Store Dashboard (stats, charts)
├── /add-medicine       → Add Medicine Form
├── /medicines          → Medicine List Table
├── /update-stock/:id   → Update Stock Form
└── /orders             → Orders Management Table
```

### Components Breakdown

#### 1. Store Navbar Component
**File:** `store-navbar.component.ts`
**Features:**
- Store logo and name
- Navigation links: Dashboard, Add Medicine, Medicines, Orders
- User profile dropdown
- Logout button
- Notifications badge

**Design:**
```html
<nav class="store-navbar">
  <div class="store-brand">
    <i class="bi bi-shop-window"></i>
    <span>{{ storeName }}</span>
  </div>
  <div class="nav-links">
    <a routerLink="/store/dashboard">Dashboard</a>
    <a routerLink="/store/add-medicine">Add Medicine</a>
    <a routerLink="/store/medicines">Medicines</a>
    <a routerLink="/store/orders">Orders</a>
  </div>
  <div class="user-menu">
    <i class="bi bi-bell" [badge]="notificationCount"></i>
    <button (click)="logout()">Logout</button>
  </div>
</nav>
```

---

#### 2. Store Dashboard Component
**File:** `store-dashboard.component.ts`
**Features:**
- 6 stat cards (Total Medicines, Low Stock, Pending Orders, Today Orders, Total Revenue, Monthly Revenue)
- Recent orders table (last 5)
- Low stock alerts
- Quick actions buttons

**Stats Cards:**
```typescript
stats = {
  totalMedicines: 150,
  lowStock: 5,
  pendingOrders: 12,
  todayOrders: 8,
  totalRevenue: 45000,
  monthlyRevenue: 125000
}
```

**Mock Service Call:**
```typescript
ngOnInit() {
  this.storeService.getDashboardStats().subscribe(stats => {
    this.stats = stats;
  });
}
```

---

#### 3. Add Medicine Component
**File:** `add-medicine.component.ts`
**Form Fields:**
- Medicine Name (text, required)
- Category (dropdown, required)
- Manufacturer (text, required)
- Price (number, required, min: 0)
- Stock Quantity (number, required, min: 0)
- Description (textarea)
- Prescription Required (checkbox)
- Expiry Date (date picker, required)
- Medicine Image (file upload)

**Validation:**
```typescript
medicineForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  category: ['', Validators.required],
  manufacturer: ['', Validators.required],
  price: [0, [Validators.required, Validators.min(0)]],
  stock: [0, [Validators.required, Validators.min(0)]],
  description: [''],
  prescription: [false],
  expiryDate: ['', Validators.required]
});
```

**Categories:**
```typescript
categories = [
  'Pain Relief', 'Antibiotics', 'Allergy', 
  'Vitamins', 'Cardiovascular', 'Diabetes',
  'Digestive Health', 'Other'
];
```

---

#### 4. Medicine List Component
**File:** `medicine-list.component.ts`
**Features:**
- Search bar (by name/category)
- Filter by category
- DataTable with columns:
  - Image thumbnail
  - Medicine Name
  - Category
  - Price
  - Stock (with color coding: red < 10, yellow < 50, green >= 50)
  - Expiry Date
  - Actions (Edit, Delete, Update Stock)
- Pagination (10 items per page)
- Stock update modal

**Table Structure:**
```html
<table class="table">
  <thead>
    <tr>
      <th>Image</th>
      <th>Medicine Name</th>
      <th>Category</th>
      <th>Price</th>
      <th>Stock</th>
      <th>Expiry</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let medicine of medicines">
      <td><img [src]="medicine.imageUrl" width="50"></td>
      <td>{{ medicine.name }}</td>
      <td>{{ medicine.category }}</td>
      <td>₹{{ medicine.price }}</td>
      <td [class]="getStockClass(medicine.stock)">
        {{ medicine.stock }}
      </td>
      <td>{{ medicine.expiryDate | date }}</td>
      <td>
        <button (click)="editMedicine(medicine)">Edit</button>
        <button (click)="updateStock(medicine)">Stock</button>
        <button (click)="deleteMedicine(medicine.id)">Delete</button>
      </td>
    </tr>
  </tbody>
</table>
```

---

#### 5. Store Orders Component
**File:** `store-orders.component.ts`
**Features:**
- Filter by status (All, Pending, Accepted, Ready, Completed)
- Orders table with columns:
  - Order Number
  - Customer Name
  - Customer Phone
  - Items Count
  - Total Amount
  - Pickup Date/Time
  - Status Badge
  - Actions (Accept/Reject for pending, Mark Ready, Mark Completed)
- Status dropdown to change order status
- View order details modal

**Status Management:**
```typescript
updateStatus(orderId: string, newStatus: string) {
  this.storeService.updateOrderStatus(orderId, newStatus)
    .subscribe(success => {
      if (success) {
        // Show success message
        this.loadOrders();
      }
    });
}
```

**Status Badge Colors:**
```typescript
getStatusClass(status: string) {
  const classes = {
    'pending': 'badge-warning',
    'accepted': 'badge-info',
    'ready': 'badge-success',
    'completed': 'badge-primary',
    'rejected': 'badge-danger'
  };
  return classes[status];
}
```

---

## 📊 ADMIN DASHBOARD MODULE

### Routes Structure
```
/admin
├── /dashboard    → Admin Dashboard (platform stats)
├── /users        → Users Management
├── /stores       → Stores Approval & Management
└── /orders       → All Orders View
```

### Components Breakdown

#### 1. Admin Navbar Component
**File:** `admin-navbar.component.ts`
**Features:**
- Admin panel branding
- Navigation: Dashboard, Users, Stores, Orders
- Search functionality
- Admin profile
- Logout

---

#### 2. Admin Dashboard Component
**File:** `admin-dashboard.component.ts`
**Features:**
- 6 stat cards:
  - Total Users
  - Total Stores
  - Pending Store Approvals
  - Total Orders
  - Total Revenue
  - Active Users Today
- Charts: 
  - Revenue trend (line chart)
  - Orders by status (pie chart)
  - User registrations (bar chart)
- Recent activities timeline
- Quick actions panel

**Stats:**
```typescript
platformStats = {
  totalUsers: 1250,
  totalStores: 45,
  pendingApprovals: 3,
  totalOrders: 5420,
  totalRevenue: 2500000,
  activeUsersToday: 180
}
```

---

#### 3. Users Management Component
**File:** `users-management.component.ts`
**Features:**
- Users table with columns:
  - User ID
  - Name
  - Email
  - Phone
  - Role (User/Store/Admin)
  - Registered Date
  - Status (Active/Inactive)
  - Actions (View, Edit, Deactivate)
- Search and filter by role
- Pagination
- Export to CSV

**Table Actions:**
```typescript
viewUser(userId: string) { }
editUser(userId: string) { }
toggleUserStatus(userId: string) { }
deleteUser(userId: string) { }
```

---

#### 4. Stores Management Component
**File:** `stores-management.component.ts`
**Features:**
- Stores table:
  - Store ID
  - Store Name
  - Owner Name
  - Phone
  - Address
  - License Number
  - Status (Pending/Approved/Rejected)
  - Actions (Approve, Reject, View Details)
- Pending approvals section (highlighted)
- Approved stores section
- Rejected stores section

**Approval Actions:**
```typescript
approveStore(storeId: string) {
  this.adminService.approveStore(storeId).subscribe();
}

rejectStore(storeId: string) {
  this.adminService.rejectStore(storeId).subscribe();
}
```

---

#### 5. Admin Orders Component
**File:** `admin-orders.component.ts`
**Features:**
- All orders from all stores
- Advanced filters:
  - By date range
  - By store
  - By status
  - By amount range
- Export functionality
- Order analytics

---

## 🔧 SHARED COMPONENTS

### 1. Footer Component
```typescript
// footer.component.ts
@Component({
  selector: 'app-footer',
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 MediBook. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  `
})
```

### 2. Sidebar Component
```typescript
// sidebar.component.ts  
@Input() menuItems: MenuItem[];
@Input() userRole: 'user' | 'store' | 'admin';
```

### 3. Medicine Card Component
```typescript
// medicine-card.component.ts
@Input() medicine: Medicine;
@Output() addToCart = new EventEmitter();
@Output() viewDetails = new EventEmitter();
```

### 4. Order Table Component
```typescript
// order-table.component.ts
@Input() orders: Order[];
@Input() showActions: boolean = true;
@Output() statusChange = new EventEmitter();
```

---

## 📦 MOCK DATA SERVICE

```typescript
// shared/services/mock-data.service.ts
@Injectable({ providedIn: 'root' })
export class MockDataService {
  
  // 50 sample medicines
  getMedicines(): Medicine[] { }
  
  // 100 sample orders
  getOrders(): Order[] { }
  
  // 200 sample users
  getUsers(): User[] { }
  
  // 50 sample stores
  getStores(): Store[] { }
  
  // Platform statistics
  getPlatformStats(): PlatformStats { }
}
```

---

## 🎨 UI/UX DESIGN SYSTEM

### Color Palette
```css
/* Store Theme - Purple */
--store-primary: #7C3AED;
--store-light: #EDE9FE;
--store-dark: #5B21B6;

/* Admin Theme - Blue */
--admin-primary: #0EA5E9;
--admin-light: #E0F2FE;
--admin-dark: #0369A1;

/* Status Colors */
--success: #10B981;
--warning: #F59E0B;
--danger: #EF4444;
--info: #3B82F6;
```

### Bootstrap Components Used
- Cards (for stats)
- Tables (for data display)
- Badges (for status)
- Buttons (actions)
- Forms (input fields)
- Modals (dialogs)
- Dropdowns (menus)
- Pagination
- Alerts (notifications)

### Icons
```bash
# Using Bootstrap Icons
<i class="bi bi-house-door"></i>
<i class="bi bi-plus-circle"></i>
<i class="bi bi-pencil-square"></i>
<i class="bi bi-trash"></i>
<i class="bi bi-check-circle"></i>
<i class="bi bi-x-circle"></i>
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Store Dashboard ✅
- [ ] Store Navbar Component
- [ ] Store Dashboard Component
- [ ] Add Medicine Component
- [ ] Medicine List Component
- [ ] Update Stock Component
- [ ] Store Orders Component
- [ ] Store Service (mock data)
- [ ] Store Routing
- [ ] Store Module

### Admin Dashboard ✅
- [ ] Admin Navbar Component
- [ ] Admin Dashboard Component
- [ ] Users Management Component
- [ ] Stores Management Component
- [ ] Admin Orders Component
- [ ] Admin Service (mock data)
- [ ] Admin Routing
- [ ] Admin Module

### Shared Components ✅
- [ ] Footer Component
- [ ] Sidebar Component
- [ ] Medicine Card Component
- [ ] Order Table Component
- [ ] Mock Data Service
- [ ] Shared Module

---

## 🚀 COMMANDS TO RUN

### Initial Setup
```bash
# Already done - Angular project exists
cd medicine-booking-platform

# Install dependencies (if not done)
npm install

# Install FontAwesome (optional, using Bootstrap Icons)
npm install @fortawesome/fontawesome-free
```

### Development
```bash
# Run development server
ng serve

# Run on specific port
ng serve --port 4200

# Open browser automatically
ng serve --open
```

### Build
```bash
# Development build
ng build

# Production build
ng build --configuration production
```

### Generate Components (if needed)
```bash
# Generate store components
ng generate component store/components/store-navbar
ng generate component store/components/store-dashboard
ng generate component store/components/add-medicine
ng generate component store/components/medicine-list
ng generate component store/components/store-orders

# Generate admin components
ng generate component admin/components/admin-navbar
ng generate component admin/components/admin-dashboard
ng generate component admin/components/users-management
ng generate component admin/components/stores-management
ng generate component admin/components/admin-orders

# Generate shared components
ng generate component shared/components/footer
ng generate component shared/components/sidebar
ng generate component shared/components/medicine-card
ng generate component shared/components/order-table
```

---

## 📊 CURRENT STATUS

### Completed (✅)
1. **Authentication Module** - 100%
   - Login (User, Store, Admin)
   - Registration
   - All working with routing

2. **User Dashboard** - 90%
   - Dashboard with stats
   - Medicine browsing
   - Search & filter
   - Add to cart
   - Cart page (basic)
   - Orders page (basic)

3. **Models & Services**
   - Store models created ✅
   - Store service with mock data ✅
   - Database config (MySQL) ✅

### To Complete (⚠️)
1. **Store Dashboard** - 0%
   - All 6 components need creation
   - Routing setup needed
   - Module configuration needed

2. **Admin Dashboard** - 0%
   - All 5 components need creation
   - Routing setup needed
   - Module configuration needed

3. **Shared Components** - 0%
   - All 4 components need creation
   - Shared module needed

4. **Database Integration** - 20%
   - MySQL config done
   - Tables schema needs completion
   - API endpoints need creation
   - Angular HTTP integration needed

---

## 💡 NEXT STEPS

### Priority 1: Complete Store Dashboard
1. Create store components (6 files each = 18 files)
2. Set up routing
3. Configure module
4. Test all features

### Priority 2: Complete Admin Dashboard  
1. Create admin components (6 files each = 18 files)
2. Set up routing
3. Configure module
4. Test all features

### Priority 3: Shared Components
1. Create reusable components (3 files each = 12 files)
2. Set up shared module
3. Export for use in other modules

### Priority 4: Database Integration
1. Complete MySQL schema
2. Create API endpoints
3. Replace mock services with HTTP calls
4. Add authentication guards

---

## 📂 FILES TO CREATE

### Store Module (27 files)
- 6 components × 3 files (TS, HTML, CSS) = 18 files
- 1 service = 1 file
- 1 model = 1 file  
- 1 module = 1 file
- 1 routing = 1 file
**Total: 22 files**

### Admin Module (23 files)
- 5 components × 3 files = 15 files
- 1 service = 1 file
- 1 model = 1 file
- 1 module = 1 file
- 1 routing = 1 file
**Total: 19 files**

### Shared Module (14 files)
- 4 components × 3 files = 12 files
- 1 service = 1 file
- 1 module = 1 file
**Total: 14 files**

### Database (10+ files)
- API routes
- Controllers
- Models
- Middleware

**GRAND TOTAL: ~70 files to complete**

---

## 🎯 ESTIMATED TIME

- Store Dashboard: 4-6 hours
- Admin Dashboard: 4-6 hours
- Shared Components: 2-3 hours
- Database Integration: 6-8 hours
- Testing & Bug Fixes: 4-6 hours

**Total: 20-29 hours**

---

**Status:** Structure documented, models and services created  
**Next:** Implement components systematically  
**Priority:** Store Dashboard → Admin Dashboard → Integration
