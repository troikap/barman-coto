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
  @Output() showAll = new EventEmitter<void>();
  @Output() showFavorites = new EventEmitter<void>();

  onShowAll() {
    this.showAll.emit();
  }

  onShowFavorites() {
    this.showFavorites.emit();
  }
}
