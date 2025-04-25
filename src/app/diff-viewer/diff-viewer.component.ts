import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Change } from 'diff'; // Assuming you have a diff library installed
@Component({
  selector: 'app-diff-viewer',
  imports: [CommonModule],
  templateUrl: './diff-viewer.component.html',
  styleUrl: './diff-viewer.component.css'
})
export class DiffViewerComponent {
  @Input() diff: Change[] = []; // The diff data passed from the parent component
}
