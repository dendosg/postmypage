import { Pipe, PipeTransform } from '@angular/core';
import { isString, isNumberFinite, isBoolean, extractDeepPropertyByMapKey, isUndefined } from './helper';

// tslint:disable no-bitwise
@Pipe({name: 'myfilter'})
export class FilterByPipe implements PipeTransform {

  public transform(input: any[], props: string[], search?: any, strict?: boolean): any[];
  public transform<T>(input: T, props: string[], search?: any, strict?: boolean): T;

  public transform(input: any, props: string[], search: any = '', strict: boolean = false): any {
    if (!Array.isArray(input) || (!isString(search) && !isNumberFinite(search) && !isBoolean(search))) {
      return input;
    }

    const term = String(search).toLowerCase();

    return input.filter((obj) => {
      return props.some((prop) => {
        const value = extractDeepPropertyByMapKey(obj, prop);
        const strValue: string = String(value).toLowerCase();

        if (isUndefined(value)) {
          return false;
        }

        return strict
          ? term === strValue
          : !!~strValue.indexOf(term);
      });
    });
  }
}
