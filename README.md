# Event Handlers
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Event Handlers


## Installation

```bash
# NPM
npm i evt-handlers

# Yarn
yarn add evt-handlers
```

## Usage

### notify.ts
```ts
import { EventHandlers, Events, Handler, Disposable } from 'evt-handlers'

interface Notify {
    alert?: (message: string, options?: Options) => void
    notice?: (message: string, options?: Options) => void
    info?: (message: string, options?: Options) => void
    success?: (message: string, options?: Options) => void
    error?: (message: string, options?: Options) => void
}

export class NotifyEventHandler {
    public eventHandler = new EventHandlers()

    public alert(message: string, Options): void {
        this.eventHandler.getNotifiers('alert')(message, options)
    }

    public notice(message: string, options?: Options): void {
        this.eventHandler.getNotifiers('notice')(message, options)
    }

    public info(message: string, options?: Options): void {
        this.eventHandler.getNotifiers('info')(message, options)
    }

    public success(message: string, options?: Options): void {
        this.eventHandler.getNotifiers('success')(message, options)
    }

    public error(message: string, options?: Options): void {
        this.eventHandler.getNotifiers('error')(message, options)
    }

    public onNotify(notify: Notify): Disposable {
        return this.eventHandler.on(notify as Events)
    }
}
```

### view-model.ts
```ts
export class AppViewModel {
    // ...

    public readonly notify: NotifyEventHandler = new NotifyEventHandler()
    public readonly historyEvent: EventHandlers = new EventHandlers()

    public *fetchData(query: string) {
        this.isLoading = true
        this.data = null
        this.error = null

        try {
            const res = yield repository.getData(query)
            this.data = res.data
            this.history(query)
        } catch (e) {
            this.error = e
            this.notify.error(e)
        }

        this.isLoading = false
    }

    public onHistory(callback: (query: string) => void): Disposable {
        return this.history.on(callback)
    }

    private get history() {
        return this.historyEvent.getNotifiers()
    }
}
```

### App.tsx
```ts
export function App() {
    const vm = useContext(AppViewModelContext)
    const notify = useNotify()
    const { location } = useRouter()

    useEffect(
        () =>
            vm.notify.onNotify({
                info(message, options) {
                    notify.info(t(message, options))
                },
                notice(message, options) {
                    notify.notice(t(message, options))
                },
                success(message, options) {
                    notify.success(t(message, options))
                },
                error(message, options) {
                    notify.error(t(message, options))
                },
                alert(message, options) {
                    notify.alert(t(message, options))
                },
            }),
        [vm.notify, notify],
    )

    useEffect(
        () =>
            vm.onHistory((query) => {
                location.search = query
            }),
        [vm, location.search],
    )

    return <div>Example</div>
}
```

## License

MIT © [Novonetworks](http://www.novonetworks.com)

[npm-image]: https://badge.fury.io/js/evt-handlers.svg
[npm-url]: https://npmjs.org/package/evt-handlers
[travis-image]: https://travis-ci.org/novonetworks/evt-handlers.svg?branch=master
[travis-url]: https://travis-ci.org/novonetworks/evt-handlers
[daviddm-image]: https://david-dm.org/novonetworks/evt-handlers.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/novonetworks/evt-handlers
[coveralls-image]: https://coveralls.io/repos/novonetworks/evt-handlers/badge.svg
[coveralls-url]: https://coveralls.io/r/novonetworks/evt-handlers
