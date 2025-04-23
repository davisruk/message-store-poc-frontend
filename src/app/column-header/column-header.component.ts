import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ColumnField } from '../state/column-fields';
import { Store } from '@ngrx/store';
import { ColumnState } from '../state/state';
import { selectColumnSearch } from '../state/message.selectors';
import { map, Observable } from 'rxjs';
import { toggleSort, searchMessages } from '../state/message.actions';
import { MatIconModule } from '@angular/material/icon';
import { ColumnsSearchInputComponent } from '../columns-search-input/columns-search-input.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-column-header',
  imports: [MatIconModule, ColumnsSearchInputComponent, CommonModule, MatButtonModule],
  templateUrl: './column-header.component.html',
  styleUrl: './column-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnHeaderComponent {

    @Input() field!: ColumnField;
    @Input() label!: string;

    private store = inject(Store);
    colState$: Observable<ColumnState> = this.store.select(selectColumnSearch).pipe(map(cs=>cs[this.field]));

    onSort() {
        this.store.dispatch(toggleSort({ field: this.field }));
        this.store.dispatch(searchMessages());
    }
}
