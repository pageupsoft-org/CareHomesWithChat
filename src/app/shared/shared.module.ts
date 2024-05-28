import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorSetterPipe } from './pipes/color-setter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';



@NgModule({
  declarations: [ColorSetterPipe],
  exports: [ColorSetterPipe,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    PaginationModule,
    ModalModule],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ]
})
export class SharedModule { }
