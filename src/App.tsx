import { useEffect, useRef, useState } from 'react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef, ColumnFiltersState, PaginationState, RowSelectionState, SortingState, VisibilityState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleHelp, Download, Layers2, ListFilter, Package, Search, ShoppingBag, SlidersHorizontal, Wallet, X } from 'lucide-react';
import { money, orders } from './data';
import type { Order } from './data';

function Checkbox({ checked, indeterminate = false, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: () => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return <input ref={ref} type="checkbox" checked={checked} onChange={onChange} aria-label={label} />;
}
const labels: Record<string, string> = { id: 'Order ID', customer: 'Customer', product: 'Product', date: 'Date', amount: 'Amount', status: 'Status', payment: 'Payment' };
const columns: ColumnDef<Order>[] = [
  { id: 'select', enableSorting: false, enableHiding: false, header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} indeterminate={table.getIsSomePageRowsSelected()} onChange={() => table.toggleAllPageRowsSelected()} label="Select all rows on this page" />, cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={() => row.toggleSelected()} label={`Select ${row.original.id}`} /> },
  { accessorKey: 'id', header: 'Order ID', enableHiding: false, cell: ({ getValue }) => <span className="order-id">#{getValue<string>().replace('ORD-', '')}</span> },
  { accessorKey: 'customer', header: 'Customer', cell: ({ row }) => <div className="customer"><span className={`avatar avatar-${Number(row.id.slice(-1)) % 4}`}>{row.original.customer.split(' ').map(n => n[0]).join('')}</span><div><span className="customer-name">{row.original.customer}</span><span className="email">{row.original.email}</span></div></div> },
  { accessorKey: 'product', header: 'Product' },
  { accessorKey: 'date', header: 'Date', cell: ({ getValue }) => new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(getValue<string>())) },
  { accessorKey: 'amount', header: 'Amount', cell: ({ getValue }) => <span className="amount">{money(getValue<number>())}</span> },
  { accessorKey: 'status', header: 'Status', filterFn: 'equalsString', cell: ({ getValue }) => <span className={`badge ${getValue<string>().toLowerCase()}`}><span />{getValue<string>()}</span> },
  { accessorKey: 'payment', header: 'Payment' },
];

export default function App() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ payment: false });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [announcement, setAnnouncement] = useState('');
  const table = useReactTable({ data: orders, columns, state: { sorting, globalFilter, columnFilters, columnVisibility, rowSelection, pagination }, onSortingChange: setSorting, onGlobalFilterChange: setGlobalFilter, onColumnFiltersChange: setColumnFilters, onColumnVisibilityChange: setColumnVisibility, onRowSelectionChange: setRowSelection, onPaginationChange: setPagination, getRowId: row => row.id, enableRowSelection: true, globalFilterFn: (row, _columnId, value: string) => Object.values(row.original).some(field => String(field).toLowerCase().includes(value.toLowerCase().trim())), getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() });
  const filtered = table.getFilteredRowModel().rows.length;
  const selected = Object.keys(rowSelection).length;
  const completed = orders.filter(row => row.status === 'Completed');
  const revenue = completed.reduce((sum, row) => sum + row.amount, 0);
  function resetFilters() { setGlobalFilter(''); setColumnFilters([]); setPagination(p => ({ ...p, pageIndex: 0 })); }
  function exportCsv() {
    const visibleColumns = table.getVisibleLeafColumns().filter(column => column.id !== 'select');
    const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = table.getSortedRowModel().rows;
    const csv = [visibleColumns.map(column => escape(labels[column.id])).join(','), ...rows.map(row => visibleColumns.map(column => escape(row.getValue(column.id))).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'ledger-orders.csv'; document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAnnouncement(`Exported ${rows.length} filtered orders with ${visibleColumns.length} visible columns.`);
  }
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="./" aria-label="Ledger home"><span className="brand-mark"><Layers2 size={21} /></span>ledger<span className="brand-dot">.</span></a><div className="workspace-label">Workspace <span>/</span> Commerce</div><div className="topbar-right"><span className="demo-label"><span />Local demo</span><span className="profile" aria-label="Alex Morgan profile">AM</span></div></header>
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
      <div className="breadcrumb">Workspace <ChevronRight size={13} /> Orders</div>
      <section className="page-heading"><div><div className="eyebrow">YOUR BUSINESS, AT A GLANCE</div><h1>Orders overview<span>.</span></h1><p>A little clarity for your everyday operations.</p></div><div className="date-chip"><span className="calendar-icon">12</span><div>October 2026<span>Demo reporting period</span></div></div></section>
      <section className="stats-grid" aria-label="All-record summary">
        <article className="stat"><div className="stat-top">Total order value<span className="stat-icon"><Wallet size={18} /></span></div><div className="stat-value">{money(orders.reduce((sum, row) => sum + row.amount, 0))}</div><div className="stat-note"><span className="positive"><ArrowUpRight size={14} />{orders.length} orders</span> across all statuses</div></article>
        <article className="stat"><div className="stat-top">Completed revenue<span className="stat-icon"><ShoppingBag size={18} /></span></div><div className="stat-value">{money(revenue)}</div><div className="stat-note"><span className="positive"><Check size={14} />{completed.length} completed</span> orders</div></article>
        <article className="stat"><div className="stat-top">In progress<span className="stat-icon"><Package size={18} /></span></div><div className="stat-value">{orders.filter(row => row.status === 'Processing' || row.status === 'Pending').length}<span className="stat-unit">orders</span></div><div className="stat-note"><span className="tiny-dot" />Pending or being processed</div></article>
      </section>
      <section className="table-panel" aria-labelledby="orders-title">
        <div className="panel-heading"><div className="panel-title"><h2 id="orders-title">All orders</h2><span className="count-pill">{orders.length}</span></div><button className="button export-button" onClick={exportCsv} disabled={!filtered} title="Export all filtered rows across pages, using visible columns"><Download size={16} />Export CSV</button></div>
        <div className="toolbar"><div className="search-field"><Search size={17} /><input aria-label="Search orders" placeholder="Search orders, customers, products…" value={globalFilter} onChange={e => { setGlobalFilter(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })); }} />{globalFilter && <button aria-label="Clear search" onClick={() => setGlobalFilter('')}><X size={15} /></button>}</div><div className="filter-controls"><label className="status-filter"><ListFilter size={16} /><select aria-label="Filter by status" value={(table.getColumn('status')?.getFilterValue() as string) ?? ''} onChange={e => { table.getColumn('status')?.setFilterValue(e.target.value || undefined); setPagination(p => ({ ...p, pageIndex: 0 })); }}><option value="">All statuses</option>{['Completed', 'Processing', 'Pending', 'Cancelled'].map(status => <option key={status}>{status}</option>)}</select></label><details className="columns-menu"><summary className="button"><SlidersHorizontal size={15} />Columns<ChevronDown size={14} /></summary><div className="columns-popover"><p>Visible columns</p>{table.getAllLeafColumns().filter(column => column.getCanHide()).map(column => <label key={column.id}><input type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} />{labels[column.id]}</label>)}</div></details></div></div>
        <div className="results-line" aria-live="polite"><span><strong>{filtered}</strong> of {orders.length} orders{(globalFilter || columnFilters.length > 0) && <button className="text-button" onClick={resetFilters}>Clear filters <X size={12} /></button>}</span><span>{selected > 0 ? <><strong>{selected}</strong> selected <button className="text-button" onClick={() => setRowSelection({})}>Clear selection</button></> : 'Select rows to keep track of orders'}</span></div>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Orders table, scroll horizontally for more columns"><table><thead>{table.getHeaderGroups().map(group => <tr key={group.id}>{group.headers.map(header => <th key={header.id} className={header.column.id === 'id' ? 'sticky-id' : ''} scope="col" aria-sort={header.column.getCanSort() ? header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none' : undefined}>{header.column.getCanSort() ? <button className="sort-button" onClick={header.column.getToggleSortingHandler()} aria-label={`Sort by ${labels[header.column.id]}`} >{flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === 'asc' ? <ArrowUp size={13} /> : header.column.getIsSorted() === 'desc' ? <ArrowDown size={13} /> : <ArrowUpDown size={13} />}</button> : flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map(row => <tr key={row.id} data-selected={row.getIsSelected()}>{row.getVisibleCells().map(cell => <td key={cell.id} className={cell.column.id === 'id' ? 'sticky-id' : ''}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody></table>{filtered === 0 && <div className="empty-state"><Search size={28} /><h3>No orders found</h3><p>Try a different search or clear your filters.</p><button className="button" onClick={resetFilters}>Clear filters</button></div>}</div>
        <footer className="pagination"><label>Rows per page <select aria-label="Rows per page" value={pagination.pageSize} onChange={e => table.setPageSize(Number(e.target.value))}>{[10, 20, 50].map(size => <option key={size}>{size}</option>)}</select></label><span className="page-range">{filtered ? pagination.pageIndex * pagination.pageSize + 1 : 0}–{Math.min((pagination.pageIndex + 1) * pagination.pageSize, filtered)} of {filtered}</span><div className="page-buttons"><button aria-label="First page" disabled={!table.getCanPreviousPage()} onClick={() => table.firstPage()}><ChevronsLeft size={16} /></button><button aria-label="Previous page" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ChevronLeft size={16} /></button><span>Page <strong>{pagination.pageIndex + 1}</strong> of {Math.max(1, table.getPageCount())}</span><button aria-label="Next page" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}><ChevronRight size={16} /></button><button aria-label="Last page" disabled={!table.getCanNextPage()} onClick={() => table.lastPage()}><ChevronsRight size={16} /></button></div></footer>
      </section>
      <div className="bottom-note"><span><CircleHelp size={14} />A sample workspace. All 120 records are generated locally.</span><span>Made for the details.</span></div><p className="sr-only" role="status">{announcement}</p>
    </main>
  </div>;
}
