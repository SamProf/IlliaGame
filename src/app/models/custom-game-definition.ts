export class CustomGameDefinition {
  op: CustomGameOperation = CustomGameOperation.Mult;
  aFrom: string = '0';
  aTo: string = '10';
  bFrom: string = '0';
  bTo: string = '10';
  factor: string = '1';
}

export enum CustomGameOperation {
  Mult = "Mult",
  Div = "Div",
}


