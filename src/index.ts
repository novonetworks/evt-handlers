export type Events =
    | {
          [key: string]: Handler
      }
    | Handler

export type Handler = (...args: any[]) => any
export type Disposable = () => void

export class EventHandlers {
    private events = new Set<Events>()

    public on(event: Events): Disposable {
        this.events.add(event)

        return (): void => {
            this.events.delete(event)
        }
    }

    public getNotifiers(identifier?: string): Handler {
        const handlers: Handler[] = []

        for (const event of this.events) {
            if (typeof event === 'function') {
                handlers.push(event)
                continue
            }

            if (!identifier) {
                continue
            }

            const handler = event[identifier]

            if (!handler) {
                throw new Error(
                    `identifier [ ${identifier} ] not exist on EventHandlers`,
                )
            }

            handlers.push(handler)
        }

        return (...args: any[]): void => {
            for (const handler of handlers) {
                handler(...args)
            }
        }
    }
}
