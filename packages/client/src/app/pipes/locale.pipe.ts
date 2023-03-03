import { Pipe, PipeTransform } from '@angular/core';
import { t } from '../locales';

@Pipe({
    name: 'locale'
})
export class LocalePipe implements PipeTransform {
  transform(value: string, args?: any): string {
    return t(value);
  }
}
