import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../../services/medicine.service';
import { CartService } from '../../services/cart.service';
import { Medicine, MedicineCategory } from '../../models/medicine.model';

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements OnInit {
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  categories: MedicineCategory[] = [];
  selectedCategory: string = 'All Medicines';
  searchQuery: string = '';
  loading = true;
  sortBy: string = 'name';
  
  sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  constructor(
    private medicineService: MedicineService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load categories
    this.medicineService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    // Load all medicines
    this.medicineService.getAllMedicines().subscribe(medicines => {
      this.medicines = medicines;
      this.filteredMedicines = medicines;
      this.loading = false;
      this.applyFilters();
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applySorting();
  }

  applyFilters(): void {
    let filtered = [...this.medicines];

    // Apply category filter
    if (this.selectedCategory !== 'All Medicines') {
      filtered = filtered.filter(m => m.category === this.selectedCategory);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.manufacturer.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      );
    }

    this.filteredMedicines = filtered;
    this.applySorting();
  }

  applySorting(): void {
    switch (this.sortBy) {
      case 'name':
        this.filteredMedicines.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        this.filteredMedicines.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        this.filteredMedicines.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        this.filteredMedicines.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
  }

  addToCart(medicine: Medicine, event: Event): void {
    event.stopPropagation();
    if (medicine.inStock) {
      this.cartService.addToCart(medicine, 1);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  getResultsText(): string {
    const count = this.filteredMedicines.length;
    if (this.searchQuery) {
      return `${count} result${count !== 1 ? 's' : ''} for "${this.searchQuery}"`;
    }
    return `${count} medicine${count !== 1 ? 's' : ''} available`;
  }
}