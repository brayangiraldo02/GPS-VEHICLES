import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-header',
  standalone: false,
  templateUrl: './search-header.component.html',
  styleUrl: './search-header.component.css',
})
export class SearchHeaderComponent {
  actionButtonLabel = input.required<string>();

  search = output<string>();
  add = output<void>();

  query = signal('');

  updateQuery(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.search.emit(value);
  }

  clearSearch() {
    this.query.set('');
    this.search.emit('');
  }
}
