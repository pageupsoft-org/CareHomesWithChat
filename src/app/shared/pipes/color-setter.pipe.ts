import { Pipe, PipeTransform } from '@angular/core';
import { FormName } from '../enums/form-name.enum';

@Pipe({
  name: 'colorSetter'
})
export class ColorSetterPipe implements PipeTransform {

  transform(value: number, maxScore: number, formName: FormName): string {
    // if (value <= 41) {
    //   return "#FF0000"; //Red
    // }
    // else if (value >= 41 && value <= 80) {
    //   return "#891522";  //Amber Red
    // }
    // else if (value >= 81 && value <= 120) {
    //   return "#9a803a"; //Amber
    // }
    // else if (value >= 121 && value <=
    //   160) {
    //   return "#FFBF00"; // Amber Green
    // }
    // else {
    //   return "#00FF00";  //Green
    // }
    let segment: number;
    if (formName == FormName.MoveOnFunctional) {
      segment = Math.round(maxScore / 5);

      if (value <= (segment * 1)) {
        return "#FF5050"; //Red
      }
      else if (value <= (segment * 2)) {
        return "#FF99CC";  //Amber Red
      }
      else if (value <= (segment * 3)) {
        return "#FFCC66"; //Amber
      }
      else if (value <= (segment * 4)) {
        return "#CCFF66"; // Amber Green
      }
      else {
        return "#00FF00";  //Green
      }
    }
    else
      segment = Math.round(maxScore / 4);

    if (value <= (segment * 1)) {
      return "#FF5050"; //Red
    }
    else if (value <= (segment * 2)) {
      return "#FF99CC";  //Amber Red
    }
    else if (value <= (segment * 3)) {
      return "#CCFF66"; // Amber Green
    }
    else {
      return "#00FF00";  //Green
    }

  }

}
