import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Navbar} from '../../components/navbar/navbar';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-moderation-dashboard',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet
  ],
  templateUrl: './moderation-dashboard.html',
  styleUrl: './moderation-dashboard.css',
})
export class ModerationDashboard {

}

