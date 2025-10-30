import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() showOnlyFavorites: boolean = false;
  @Input() showFilters: boolean = false;
  @Output() showAll = new EventEmitter<void>();
  @Output() showFavorites = new EventEmitter<void>();
  @Output() showFiltersChange = new EventEmitter<void>();

  onShowAll() {
    this.showAll.emit();
  }

  onShowFavorites() {
    this.showFavorites.emit();
  }

  onShowFilters() {
    this.showFiltersChange.emit();
  }
}
