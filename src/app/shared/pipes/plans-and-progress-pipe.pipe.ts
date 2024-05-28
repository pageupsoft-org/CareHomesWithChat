import { Pipe, PipeTransform } from '@angular/core';
import { PlansAndProgresses } from '../models/plan-and-progress';

@Pipe({
  name: 'plansAndProgressPipe'
})
export class PlansAndProgressPipePipe implements PipeTransform {

  transform(value: PlansAndProgresses[], input: string): PlansAndProgresses[] {
    if (input) {
      return value.filter(val => val.sectionName == input)
    } else {
      return value;
    }
  }

}
