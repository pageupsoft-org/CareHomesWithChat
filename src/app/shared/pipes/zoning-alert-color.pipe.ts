import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zoningAlertColor'
})
export class ZoningAlertColorPipe implements PipeTransform {

  transform(endDate: Date): string {

    if(!endDate){
      return ;
    }

    let date1 = new Date(endDate);
    let date2 = new Date();

    var time = date1.getTime() - date2.getTime();
    var days = time / (1000 * 3600 * 24); //Diference in Days

    if (days <= 0) {
      return "rgb(255 102 102)"; 
    }

    if (days <= 3) {
      return "rgb(208 204 88)";
    }
  }

}
