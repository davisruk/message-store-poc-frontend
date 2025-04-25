import { Injectable } from '@angular/core';
import { diffLines, Change } from 'diff'; // Assuming you have a type for Change

@Injectable({
  providedIn: 'root'
})
export class DiffService {

  constructor() { }

  diffMessages(a: string, b: string): Change[] {
    const normA = a.replace(/\r\n/g, '\n');
    const normB = b.replace(/\r\n/g, '\n');
    return diffLines(normA, normB);
  }
}
