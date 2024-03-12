import { Component, Input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  providers: [MessageService],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 2 })),
      transition('* <=> *', [
        animate(300)
      ])
    ])
  ]
})
export class SpinnerComponent {
  show: boolean = false;
  message:string='';
}