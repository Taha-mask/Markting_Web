import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';



interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}


@Component({
    selector: 'app-cart',
    imports: [CommonModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent {
  products: Product[] = [
    { id: 1, name: ' Macbook ', price: 420, image: 'https://i.pinimg.com/736x/36/2f/47/362f47c55ccd45c5aea11ca12b018e04.jpg' },
    { id: 2, name: ' Tablet ', price: 320, image: 'https://i.pinimg.com/736x/a1/81/c9/a181c9d8d881bb268b6d4c983d7efd1a.jpg'},
    { id: 3, name: 'Keyboard', price: 800, image: 'https://i.pinimg.com/736x/97/e8/cc/97e8cc6e14dbcf4b3ff2096268f01afb.jpg' },
    { id: 4, name: 'Headphones', price: 150, image: 'https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg' },
    { id: 5, name: 'Watch', price: 250, image: 'https://i.pinimg.com/736x/37/a8/ae/37a8ae2095512429d5d0ffa5d8675378.jpg' },
    { id: 6, name: 'Laptop Stand', price: 50, image: 'https://i.pinimg.com/736x/4f/b5/3d/4fb53dfa1af12594f128e924ba91d114.jpg' },
    { id: 7, name: 'Airboads', price: 100, image: 'https://i.pinimg.com/736x/6f/09/ad/6f09ad7bc17beab600a89e3112455b14.jpg' },
  { id: 8, name: 'Speakers', price: 200, image: 'https://i.pinimg.com/736x/bd/ab/c4/bdabc47e32d0770253c1899894e30648.jpg' }
  ];
    // Add more products here
  ;

  cartItems: CartItem[] = [];

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
  }

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  totalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  checkout(): void {
    alert('Proceeding to checkout...');
}
}
