import { FormsModule } from '@angular/forms';
import { ICategory } from '../../shared/interfaces/icategory';
import { SearchPipe } from '../../shared/pipes/serach/search.pipe';
import { CategoriesService } from './../../core/services/categories/categories.service';
import { Component, inject, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, SearchPipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  categoriesService = inject(CategoriesService);

  searchText: WritableSignal<string> = signal('');
  categories: WritableSignal<ICategory[]> = signal([]);

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        //console.log(res);
        this.categories.set(res.data);
        console.log(this.categories());
      },
    });
  }
}
