import { FormsModule } from '@angular/forms';
import { BrandsService } from './../../core/services/brands/brands.service';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { IBrand } from '../../shared/interfaces/ibrand';
import { SearchPipe } from '../../shared/pipes/serach/search.pipe';

@Component({
  selector: 'app-brands',
  imports: [FormsModule, SearchPipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  brandsService = inject(BrandsService);
  searchText: WritableSignal<string> = signal('');
  brands: WritableSignal<IBrand[]> = signal([]);

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        //console.log(res);
        this.brands.set(res.data);
        console.log(this.brands());
      },
    });
  }
}
