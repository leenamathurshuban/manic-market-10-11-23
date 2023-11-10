import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'AmountFormat',
})
export class CustomThousandSuffixesPipePipe implements PipeTransform {
  transform(input: any, args?: any): any {
    var exp,
      rounded,
      suffixes = ['k', 'M', 'B', 'T', 'P', 'E'];

    if (Number.isNaN(input)) {
      return null;
    }

    if (input < 1000000 && input < 0) {
     
      if(input > -1000000){
        return input
      }
      
      input = Math.abs(input);
      exp = Math.floor(Math.log(input) / Math.log(1000));

      return (
        '-' + (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1]
      );
    }

    if (input < 1000000 && input > 0) {
      const formattedValue = input.toFixed(args = 0);
      return formattedValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    if (input <= 0) {
      return input;
    }

    exp = Math.floor(Math.log(input) / Math.log(1000));

    return (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
  // transform(input: any, args?: any): any {
  //   var exp, rounded,
  //     suffixes = ['k', 'M', 'B', 'T', 'P', 'E'];

  //   if (Number.isNaN(input)) {
  //     return null;
  //   }

  //   if (input < 1000000) {
  //     return input;
  //   }

  //   exp = Math.floor(Math.log(input) / Math.log(1000));

  //   return (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];


  }
}