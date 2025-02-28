import { FormsModule } from '@angular/forms';
import { ICategory } from '../../shared/interfaces/icategory';
import { SearchPipe } from '../../shared/pipes/serach/search.pipe';
import { CategoriesService } from './../../core/services/categories/categories.service';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, SearchPipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categoriesService = inject(CategoriesService);

  searchText: WritableSignal<string> = signal('');
  categories: WritableSignal<ICategory[]> = signal([]);
  getAllCategoriesSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.getAllCategoriesSubscription = this.categoriesService
      .getAllCategories()
      .subscribe({
        next: (res) => {
          //console.log(res);
          this.categories.set(res.data);
          console.log(this.categories());
        },
      });
  }

  ngOnDestroy(): void {
    this.getAllCategoriesSubscription.unsubscribe();
  }
}
