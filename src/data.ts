export type Status = 'Completed' | 'Processing' | 'Pending' | 'Cancelled';
export interface Order { id: string; customer: string; email: string; product: string; date: string; amount: number; status: Status; payment: string }
const customers = ['Olivia Rhye', 'Phoenix Baker', 'Lana Steiner', 'Demi Wilkinson', 'Drew Cano', 'Natali Craig', 'Orlando Diggs', 'Andi Lane', 'Kate Morrison', 'Noah Williams', 'Sofia Chen', 'James Wilson', 'Isabella Rossi', 'Lucas Martin', 'Amara Okafor', 'Ethan Brooks', 'Mia Nakamura', 'Leo Garcia', 'Ava Thompson', 'Oliver Kim'];
const products = ['Studio headphones', 'Mechanical keyboard', 'Desk lamp', 'Everyday backpack', 'Wireless mouse', 'USB-C hub', 'Canvas notebook', 'Monitor stand'];
const statuses: Status[] = ['Completed', 'Completed', 'Processing', 'Completed', 'Pending', 'Completed', 'Processing', 'Cancelled'];
export const orders: Order[] = Array.from({ length: 120 }, (_, i) => {
  const customer = customers[(i * 7) % customers.length];
  return { id: `ORD-${2080 - i}`, customer, email: `${customer.toLowerCase().replaceAll(' ', '.')}@example.com`, product: products[(i * 3) % products.length], date: new Date(Date.UTC(2026, 9, 12 - Math.floor(i / 4))).toISOString().slice(0, 10), amount: (4900 + ((i * 7919) % 42000)) / 100, status: statuses[i % statuses.length], payment: ['Visa', 'Mastercard', 'PayPal'][i % 3] };
});
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
