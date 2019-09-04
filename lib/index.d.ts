export declare type Events =
    | {
          [key: string]: Handler
      }
    | Handler
export declare type Handler = (...args: any[]) => any
export declare type Disposable = () => void
export declare class EventHandlers {
    private events
    on(event: Events): Disposable
    getNotifiers(identifier?: string): Handler
}
