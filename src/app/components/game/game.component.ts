import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CustomGameOperation} from '../../models/custom-game-definition';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {


  date: Date = new Date();

  timer: number;

  destroy$: Subject<boolean> = new Subject();
  title = 'illia-game';

  game: Game;
  overlayVisible: boolean = false;
  overlayAnswer: boolean = false;
  overlay: string;
  private overlayTimout: number;
  gameName: GameNames;
  endGif: string;
  endGifs = [
    'https://acegif.com/wp-content/uploads/fireworks-2.gif',
    'https://i.gifer.com/4BJW.gif',
    'https://i.gifer.com/32Wp.gif',
    'https://i.gifer.com/H8EN.gif',
    'https://i.gifer.com/OoZ.gif',
    'https://i.gifer.com/1ej4.gif',
    'https://i.gifer.com/9gbw.gif',
    'https://i.gifer.com/7E2d.gif',
    'https://i.gifer.com/5rT.gif',
    'https://i.gifer.com/fxqO.gif',
    'https://i.gifer.com/2Tw.gif'

  ];


  constructor(private route: ActivatedRoute,) {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.gameName = <GameNames> (<any> GameNames[params['gameName']]) || GameNames.Unknown;
        this.newGame();
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    clearInterval(this.timer);
  }


  dateDiff(date_future: any, date_now: any) {
    // get total seconds between the times
    var delta = Math.abs(date_future - date_now) / 1000;

// calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

// calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

// calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

// what's left is seconds
    var seconds = Math.floor(delta % 60);  // in theory the modulus is not required

    return `${hours}:${minutes}:${seconds}`;
  }

  newGame() {
    this.game = {
      dateFrom: new Date(),
      dateTo: null,
      items: [],
      log: [],
      current: null,
      answers: 0,
      mistakes: 0
    };
    this.date = new Date();

    if (this.gameName == GameNames.mult_0_10) {

      for (var a = 0; a <= 10; a++) {
        for (var b = 0; b <= 10; b++) {
          this.game.items.push({
            text: `${a} · ${b}`,
            answer: (a * b).toString()
          });
        }
      }
    }

    if (this.gameName == GameNames.mult_2_9) {

      for (var c = 0; c < 2; c++) {
        for (var a = 2; a < 10; a++) {
          for (var b = 2; b < 10; b++) {
            this.game.items.push({
              text: `${a} · ${b}`,
              answer: (a * b).toString()
            });
          }
        }
      }
    }


    if (this.gameName == GameNames.div_1_10) {

      for (var a = 1; a <= 10; a++) {
        for (var b = 0; b < 10; b++) {
          this.game.items.push({
            text: `${a * b} ÷ ${a}`,
            answer: (b).toString()
          });
        }
      }

    }

    if (this.gameName == GameNames.div_1_10) {

      for (var a = 1; a <= 10; a++) {
        for (var b = 0; b <= 10; b++) {
          this.game.items.push({
            text: `${a * b} ÷ ${a}`,
            answer: (b).toString()
          });
        }
      }

    }


    if (this.gameName == GameNames.mult_11_20) {

      for (var a = 0; a <= 10; a++) {
        for (var b = 11; b <= 20; b++) {
          this.game.items.push({
            text: `${a} · ${b}`,
            answer: (a * b).toString()
          });
        }
      }
    }


    if (this.gameName == GameNames.div_11_20) {

      for (var a = 1; a <= 10; a++) {
        for (var b = 11; b <= 20; b++) {
          this.game.items.push({
            text: `${a * b} ÷ ${a}`,
            answer: (b).toString()
          });
        }
      }

    }


    if (this.gameName == GameNames.custom) {

      var aFrom = parseInt(this.route.snapshot.queryParams['aFrom']);
      var aTo = parseInt(this.route.snapshot.queryParams['aTo']);
      var bFrom = parseInt(this.route.snapshot.queryParams['bFrom']);
      var bTo = parseInt(this.route.snapshot.queryParams['bTo']);
      var factor = parseInt(this.route.snapshot.queryParams['factor']);
      var op: CustomGameOperation = CustomGameOperation[(this.route.snapshot.queryParams['op'])];


      for (var ifactor = 0; ifactor < factor; ifactor++) {
        for (var a = aFrom; a <= aTo; a++) {
          for (var b = bFrom; b <= bTo; b++) {

            var result: string;
            var text: string;

            switch (op) {
              case CustomGameOperation.Mult:
                text = `${a} · ${b}`;
                result = `${a * b}`;
                break;
              case CustomGameOperation.Div:
                if (a == 0) {
                  continue;
                }
                text = `${a * b} ÷ ${a}`;
                result = `${b}`;
                break;
            }
            this.game.items.push({
              text: text,
              answer: result
            });
          }
        }
      }

    }


    shuffleArray(this.game.items);

    // this.game.items = [this.game.items[0]];

    this.nextItem();


  };

  nextItem() {
    if (this.game.items.length) {
      this.game.current = {
        answer: null,
        item: this.game.items.shift(),
        dateFrom: new Date(),
        dateTo: null
      };
    } else {
      this.game.current = null;
      this.game.dateTo = new Date();
      this.endGif = this.endGifs[getRandomInt(0, this.endGifs.length)];
    }

  }

  okClick() {
    this.game.current.answer = this.game.current.answer?.trim();

    if (!this.game.current.answer) {
      return;
    }

    this.game.current.dateTo = new Date();
    this.overlay = this.game.current.item.text + ' = ' + this.game.current.item.answer;
    var logText = this.game.current.item.text + ' = ' + this.game.current.answer + '  (' + this.game.current.item.answer + ') ' + this.dateDiff(this.game.current.dateTo, this.game.current.dateFrom);
    var answer = this.game.current.answer.toLowerCase() == this.game.current.item.answer.toLowerCase();
    if (answer) {
      this.game.answers++;
      this.overlayAnswer = true;
      console.log(logText);
    } else {
      this.game.mistakes++;
      this.overlayAnswer = false;
      this.game.items.push(this.game.current.item);
      console.warn(logText);
    }

    this.game.log.push(this.game.current);

    if (this.overlayTimout) {
      clearTimeout(this.overlayTimout);
    }
    this.overlayVisible = true;
    this.overlayTimout = setTimeout(() => {
      this.overlayVisible = false;
    }, 3000);

    this.nextItem();

  }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.date = new Date();
    }, 1000);
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

export interface Game {
  dateTo: Date;
  mistakes: number;
  answers: number;
  items: GameItem[];
  current: GameLogItem;
  log: GameLogItem[];
  dateFrom: Date;
}


export interface GameItem {
  text: string;
  answer: string;
}


enum GameNames {
  Unknown,
  mult_0_10,
  mult_2_9,
  div_1_10,
  mult_11_20,
  div_11_20,
  custom
}

export interface GameLogItem {
  item: GameItem;
  answer: string;
  dateFrom: Date;
  dateTo: Date;
}

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

