export class Pagination<T> {
  items: T[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  maxVisiblePages = 5; // how many page numbers to show

  constructor(items: T[], pageSize: number = 10) {
    this.items = items;
    this.pageSize = pageSize;
  }

  get totalItems() {
    return this.items.length;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get paginatedItems(): T[] {
    const start = this.pageIndex * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  }

  // ========== PAGE NAVIGATION ==========
  first() {
    this.pageIndex = 0;
  }

  last() {
    this.pageIndex = this.totalPages - 1;
  }

  next() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
    }
  }

  prev() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  goToPage(i: number) {
    if (i >= 0 && i < this.totalPages) {
      this.pageIndex = i;
    }
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.pageIndex = 0;
  }

  // ========== VISIBLE PAGE NUMBERS ==========
  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.pageIndex;
    const max = this.maxVisiblePages;

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i);
    }

    let start = Math.max(current - Math.floor(max / 2), 0);
    let end = start + max;

    if (end > total) {
      end = total;
      start = end - max;
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  // ========== HELPERS FOR UI (ELLIPSIS) ==========
  get showLeftEllipsis(): boolean {
    return this.visiblePages[0] > 0;
  }

  get showRightEllipsis(): boolean {
    return this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
  }

  get startItem(): number {
    return this.totalItems === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get endItem(): number {
    const end = (this.pageIndex + 1) * this.pageSize;
    return end > this.totalItems ? this.totalItems : end;
  }

}
