export namespace mapmodel {
  export class ControlOpts {
    constructor(
      public scale: boolean = false,
      public fullscreen: boolean = false
    ) { }
  }

  export class DrawToolOpts {
    constructor(
      public drawevent: string = '',
      public layer: any = null,
      public type: any = null
    ) { }
  }
}
