import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Medicine, MedicineCategory } from '../models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private medicines: Medicine[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      description: 'Effective pain relief and fever reducer. Suitable for adults and children above 6 years.',
      category: 'Pain Relief',
      manufacturer: 'PharmaCorp',
      price: 45.00,
      discountPrice: 38.25,
      inStock: true,
      stockQuantity: 150,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      prescription: false,
      dosage: '1-2 tablets every 4-6 hours',
      rating: 4.5,
      reviewCount: 234
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      description: 'Antibiotic used to treat bacterial infections including respiratory infections.',
      category: 'Antibiotics',
      manufacturer: 'MediLife',
      price: 120.00,
      inStock: true,
      stockQuantity: 80,
      imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
      prescription: true,
      dosage: '1 capsule three times daily',
      rating: 4.7,
      reviewCount: 156
    },
    {
      id: '3',
      name: 'Cetirizine 10mg',
      description: 'Antihistamine for relief from allergies, hay fever, and urticaria.',
      category: 'Allergy',
      manufacturer: 'AllerCare',
      price: 65.00,
      discountPrice: 55.25,
      inStock: true,
      stockQuantity: 200,
      imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
      prescription: false,
      dosage: '1 tablet once daily',
      rating: 4.3,
      reviewCount: 89
    },
    {
      id: '4',
      name: 'Omeprazole 20mg',
      description: 'Proton pump inhibitor for treating acid reflux and stomach ulcers.',
      category: 'Digestive Health',
      manufacturer: 'GastroMed',
      price: 95.00,
      inStock: true,
      stockQuantity: 120,
      imageUrl: 'https://images.unsplash.com/photo-1550572017-4a6c5c6a3f6a?w=400',
      prescription: true,
      dosage: '1 capsule before breakfast',
      rating: 4.6,
      reviewCount: 178
    },
    {
      id: '5',
      name: 'Vitamin D3 1000IU',
      description: 'Essential vitamin supplement for bone health and immune system support.',
      category: 'Vitamins',
      manufacturer: 'VitaHealth',
      price: 280.00,
      discountPrice: 238.00,
      inStock: true,
      stockQuantity: 90,
      imageUrl: 'https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?w=400',
      prescription: false,
      dosage: '1 tablet daily with food',
      rating: 4.8,
      reviewCount: 312
    },
    {
      id: '6',
      name: 'Aspirin 75mg',
      description: 'Low-dose aspirin for cardiovascular protection and blood thinning.',
      category: 'Cardiovascular',
      manufacturer: 'CardioPlus',
      price: 52.00,
      inStock: true,
      stockQuantity: 180,
      imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400',
      prescription: true,
      dosage: '1 tablet once daily',
      rating: 4.4,
      reviewCount: 145
    },
    {
      id: '7',
      name: 'Ibuprofen 400mg',
      description: 'Non-steroidal anti-inflammatory drug for pain, fever, and inflammation.',
      category: 'Pain Relief',
      manufacturer: 'PainFree',
      price: 58.00,
      discountPrice: 49.30,
      inStock: true,
      stockQuantity: 160,
      imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
      prescription: false,
      dosage: '1-2 tablets every 6-8 hours',
      rating: 4.6,
      reviewCount: 201
    },
    {
      id: '8',
      name: 'Metformin 500mg',
      description: 'First-line medication for type 2 diabetes management.',
      category: 'Diabetes',
      manufacturer: 'DiabeCare',
      price: 135.00,
      inStock: true,
      stockQuantity: 70,
      imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
      prescription: true,
      dosage: '1 tablet twice daily with meals',
      rating: 4.5,
      reviewCount: 167
    },
    {
      id: '9',
      name: 'Multivitamin Complex',
      description: 'Comprehensive daily multivitamin with minerals for overall health.',
      category: 'Vitamins',
      manufacturer: 'VitaHealth',
      price: 425.00,
      discountPrice: 361.25,
      inStock: true,
      stockQuantity: 110,
      imageUrl: 'https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?w=400',
      prescription: false,
      dosage: '1 tablet daily with breakfast',
      rating: 4.7,
      reviewCount: 289
    },
    {
      id: '10',
      name: 'Loratadine 10mg',
      description: 'Non-drowsy antihistamine for 24-hour allergy relief.',
      category: 'Allergy',
      manufacturer: 'AllerCare',
      price: 72.00,
      inStock: false,
      stockQuantity: 0,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      prescription: false,
      dosage: '1 tablet once daily',
      rating: 4.4,
      reviewCount: 98
    },
    {
      id: '11',
      name: 'Azithromycin 500mg',
      description: 'Broad-spectrum antibiotic for various bacterial infections.',
      category: 'Antibiotics',
      manufacturer: 'MediLife',
      price: 185.00,
      inStock: true,
      stockQuantity: 55,
      imageUrl: 'https://images.unsplash.com/photo-1550572017-4a6c5c6a3f6a?w=400',
      prescription: true,
      dosage: '1 tablet once daily for 3-5 days',
      rating: 4.6,
      reviewCount: 134
    },
    {
      id: '12',
      name: 'Calcium + Vitamin D',
      description: 'Combined supplement for strong bones and teeth.',
      category: 'Vitamins',
      manufacturer: 'BoneStrong',
      price: 315.00,
      discountPrice: 267.75,
      inStock: true,
      stockQuantity: 95,
      imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400',
      prescription: false,
      dosage: '1-2 tablets daily',
      rating: 4.5,
      reviewCount: 176
    }
  ];

  private categories: MedicineCategory[] = [
    { id: '1', name: 'All Medicines', icon: 'bi-grid', count: 12 },
    { id: '2', name: 'Pain Relief', icon: 'bi-capsule', count: 2 },
    { id: '3', name: 'Antibiotics', icon: 'bi-virus', count: 2 },
    { id: '4', name: 'Allergy', icon: 'bi-flower3', count: 2 },
    { id: '5', name: 'Vitamins', icon: 'bi-heart-pulse', count: 3 },
    { id: '6', name: 'Digestive Health', icon: 'bi-activity', count: 1 },
    { id: '7', name: 'Cardiovascular', icon: 'bi-heart', count: 1 },
    { id: '8', name: 'Diabetes', icon: 'bi-droplet', count: 1 }
  ];

  constructor() { }

  getAllMedicines(): Observable<Medicine[]> {
    return of(this.medicines).pipe(delay(500));
  }

  getMedicineById(id: string): Observable<Medicine | undefined> {
    return of(this.medicines.find(m => m.id === id)).pipe(delay(300));
  }

  searchMedicines(query: string): Observable<Medicine[]> {
    const filtered = this.medicines.filter(m =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(400));
  }

  getMedicinesByCategory(category: string): Observable<Medicine[]> {
    if (category === 'All Medicines') {
      return this.getAllMedicines();
    }
    const filtered = this.medicines.filter(m => m.category === category);
    return of(filtered).pipe(delay(400));
  }

  getCategories(): Observable<MedicineCategory[]> {
    return of(this.categories);
  }

  getFeaturedMedicines(): Observable<Medicine[]> {
    const featured = this.medicines.filter(m => m.rating && m.rating >= 4.5).slice(0, 6);
    return of(featured).pipe(delay(500));
  }
}