import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject();
  title = 'illia-game';

  game: Game;
  overlayVisible: boolean = false;
  overlayAnswer: boolean = false;
  overlay: string;
  private overlayTimout: number;
  gameName: GameNames;
  endGif:string;
  endGifs = [
    "https://acegif.com/wp-content/uploads/fireworks-2.gif",
    "https://i.gifer.com/4BJW.gif",
    "https://i.gifer.com/32Wp.gif",
    "https://i.gifer.com/H8EN.gif",
    "https://i.gifer.com/OoZ.gif",
    "https://i.gifer.com/1ej4.gif",
    "https://i.gifer.com/9gbw.gif",
    "https://i.gifer.com/7E2d.gif",
    "https://i.gifer.com/5rT.gif",
    "https://i.gifer.com/fxqO.gif",
    "https://i.gifer.com/2Tw.gif"

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
  }


  newGame() {
    this.game = {
      items: [],
      log: [],
      current: null,
      answers: 0,
      mistakes: 0
    };

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


    shuffleArray(this.game.items);

    // this.game.items = [this.game.items[0]];

    this.nextItem();


  };

  nextItem() {
    if (this.game.items.length) {
      this.game.current = {
        answer: null,
        item: this.game.items.shift()
      };
    } else {
      this.game.current = null;
      this.endGif = this.endGifs[getRandomInt(0, this.endGifs.length)];
    }

  }

  okClick() {
    this.game.current.answer = this.game.current.answer?.trim();

    if (!this.game.current.answer) {
      return;
    }
    this.overlay = this.game.current.item.text + ' = ' + this.game.current.item.answer;
    var logText = this.game.current.item.text + ' = ' + this.game.current.answer + '  (' + this.game.current.item.answer + ')';
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
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

export interface Game {
  mistakes: number;
  answers: number;
  items: GameItem[];
  current: GameLogItem;
  log: GameLogItem[];
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
}

export interface GameLogItem {
  item: GameItem;
  answer: string;
}

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

