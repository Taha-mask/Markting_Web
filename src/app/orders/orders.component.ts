import { Component , OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  idCounter = 1;
  showFormText = '+ New Order';

  ngOnInit() {
    this.loadOrdersFromStorage();
  }

  // عرض الطلبات المحفوظة من localStorage
  loadOrdersFromStorage() {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    for (const order of savedOrders) {
      this.addOrderToTable(order);
    }
    this.idCounter = savedOrders.length + 1;
  }

  toggleForm() {
    const form = document.getElementById('orderFormContainer');
    if (form) {
      const hidden = form.hasAttribute('hidden');
      if (hidden) {
        form.removeAttribute('hidden');
        this.showFormText = 'Cancel';
      } else {
        form.setAttribute('hidden', 'true');
        this.showFormText = '+ New Order';
      }
    }
  }

  addOrder(event: Event) {
    event.preventDefault();

    const customerInput = <HTMLInputElement>document.getElementById('customerInput');
    const amountInput = <HTMLInputElement>document.getElementById('amountInput');
    const statusInput = <HTMLSelectElement>document.getElementById('statusInput');

    const customer = customerInput.value.trim();
    const amount = amountInput.value;
    const status = statusInput.value;

    if (!customer || !amount || !status) return;

    if (status === 'cancelled') {
      this.toggleForm();
      return; // لا يتم الحفظ إذا كانت الحالة "cancelled"
    }

    const today = new Date().toISOString().slice(0, 10);
    const newOrder = {
      id: this.idCounter,
      date: today,
      customer,
      amount,
      status
    };

    this.addOrderToTable(newOrder);
    this.saveOrderToLocalStorage(newOrder);

    this.idCounter++;
    customerInput.value = '';
    amountInput.value = '';
    statusInput.value = 'pending';
    this.toggleForm();
  }

  // يضيف الطلب إلى الجدول
  addOrderToTable(order: any) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.date}</td>
      <td>${this.escapeHtml(order.customer)}</td>
      <td>$${order.amount}</td>
      <td><span class="status ${order.status}">${order.status}</span></td>
    `;
    tbody.appendChild(row);
  }

  // حفظ الطلب في localStorage
  saveOrderToLocalStorage(order: any) {
    const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    currentOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(currentOrders));
  }

  // فلترة الجدول
  filterOrders() {
    const input = <HTMLInputElement>document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const rows = tbody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const rowText = rows[i].innerText.toLowerCase();
      rows[i].style.display = rowText.includes(filter) ? '' : 'none';
    }
  }

  // حماية من إدخال HTML
  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }
}