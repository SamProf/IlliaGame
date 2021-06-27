import { Component, OnInit } from '@angular/core';
import {CustomGameDefinition, CustomGameOperation} from '../../models/custom-game-definition';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  custom : CustomGameDefinition = new CustomGameDefinition();

  CustomGameOperation = CustomGameOperation;

  ngOnInit(): void {
  }

  customStart() {
    this.router.navigate(["game", "custom"], {
      queryParams: this.custom
    })
  }
}
