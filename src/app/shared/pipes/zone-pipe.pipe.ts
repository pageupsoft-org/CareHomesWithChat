import { Pipe, PipeTransform } from '@angular/core';
import { PatientAdmission } from '../models/patient-admission';

@Pipe({
  name: 'zonePipe'
})
export class ZonePipePipe implements PipeTransform {

  transform(value: PatientAdmission[], input: string): PatientAdmission[] {
    if (input) {
      return value.filter(val => val.zoningCategory == input)
    } else {
      return value;
    }
  }

}
