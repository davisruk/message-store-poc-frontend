import { Injectable } from '@angular/core';
import { diffWordsWithSpace, Change } from 'diff'; // Assuming you have a type for Change

@Injectable({
  providedIn: 'root'
})
export class DiffService {

  constructor() { }

  diffMessages(a: string, b: string): Change[] {
    const normA = a.replace(/\r\n/g, '\n');
    const normB = b.replace(/\r\n/g, '\n');
    return diffWordsWithSpace(normA, normB);
  }
}
