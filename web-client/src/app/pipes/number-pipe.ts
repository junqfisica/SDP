import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'noCommaNumber'})
export class NoCommaNumberPipe implements PipeTransform {

  transform(val: number): string {
    // Format the output to display any way you want here.
    // For instance:
    if (val !== undefined && val !== null) {
       return val.toString().replace(',',"");
    } else {
      return '';
    }
  }
}