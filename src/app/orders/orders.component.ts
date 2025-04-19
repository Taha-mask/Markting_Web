import { Component } from '@angular/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  idCounter = 1;
  showFormText = '+ New Order';

  ngAfterViewInit() {
    // ممكن نستخدمه في حال أردت إعداد شيء بعد ظهور العناصر
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

    // إذا كانت الحالة "Cancelled"، لا نضيف الطلب
    if (status === 'cancelled') {
      this.toggleForm();
      return; // لا نضيف الطلب في حالة الإلغاء
    }

    if (!customer || !amount || !status) return;

    const today = new Date().toISOString().slice(0, 10);
    const tbody = document.getElementById('ordersTableBody');

    if (tbody) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>#${this.idCounter}</td>
        <td>${today}</td>
        <td>${this.escapeHtml(customer)}</td>
        <td>$${amount}</td>
        <td><span class="status ${status}">${status}</span></td>
      `;
      tbody.appendChild(row);
      this.idCounter++;
    }

    // Clear inputs manually
    customerInput.value = '';
    amountInput.value = '';
    statusInput.value = 'pending';

    this.toggleForm();
  }

  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // البحث داخل الجدول
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
}