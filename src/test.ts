import { Disposable, EventHandlers, Events, Handler } from '~/index'

interface Notify {
    alert?: (message: string, options?: { [s: string]: any }) => void
    notice?: (message: string, options?: { [s: string]: any }) => void
    info?: (message: string, options?: { [s: string]: any }) => void
    success?: (message: string, options?: { [s: string]: any }) => void
    error?: (message: string, options?: { [s: string]: any }) => void
}

export class NotifyEventHandler {
    public eventHandler = new EventHandlers()

    public alert(message: string, options?: { [s: string]: any }): void {
        this.eventHandler.getNotifiers('alert')(message, options)
    }

    public notice(message: string, options?: { [s: string]: any }): void {
        this.eventHandler.getNotifiers('notice')(message, options)
    }

    public info(message: string, options?: { [s: string]: any }): void {
        this.eventHandler.getNotifiers('info')(message, options)
    }

    public success(message: string, options?: { [s: string]: any }): void {
        this.eventHandler.getNotifiers('success')(message, options)
    }

    public error(message: string, options?: { [s: string]: any }): void {
        this.eventHandler.getNotifiers('error')(message, options)
    }

    public onNotify(notify: Notify | Handler): Disposable {
        return this.eventHandler.on(notify as Events)
    }
}

describe('NotifyEventHandler', () => {
    test('object style event notify correctly', () => {
        const notify = new NotifyEventHandler()

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const info = jest.fn((..._args: any[]) => {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const notice = jest.fn((..._args: any[]) => {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const success = jest.fn((..._args: any[]) => {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const error = jest.fn((..._args: any[]) => {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const alert = jest.fn((..._args: any[]) => {})

        const disposable = notify.onNotify({
            info(message, options) {
                info(message, options)
            },
            notice(message, options) {
                notice(message, options)
            },
            success(message, options) {
                success(message, options)
            },
            error(message, options) {
                error(message, options)
            },
            alert(message, options) {
                alert(message, options)
            },
        })

        notify.info('info')
        expect(info).toBeCalledWith('info', undefined)
        notify.notice('notice')
        expect(notice).toBeCalledWith('notice', undefined)
        notify.success('success')
        expect(success).toBeCalledWith('success', undefined)
        notify.error('error')
        expect(error).toBeCalledWith('error', undefined)
        notify.alert('alert')
        expect(alert).toBeCalledWith('alert', undefined)

        expect(notify.eventHandler['events'!].size).toEqual(1)
        disposable()
        expect(notify.eventHandler['events'!].size).toEqual(0)
    })

    test('object style event do not notify with empty identifier', () => {
        const notify = new EventHandlers()

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const info = jest.fn((..._args: any[]) => {})

        notify.on({
            info,
        })

        notify.getNotifiers()('info')
        expect(info).not.toBeCalledWith()
    })

    test('object style event do not notify with wrong identifier', () => {
        const notify = new EventHandlers()
        const catcher = jest.fn()

        notify.on({})

        try {
            notify.getNotifiers('alert')('alert')
        } catch (e) {
            catcher(e)
        }

        expect(catcher).toBeCalledWith(
            new Error('[ alert ] handler is not exist on EventHandlers'),
        )
    })

    test('function style event notify correctly', () => {
        const notify = new EventHandlers()

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const cb = jest.fn((..._args: any[]) => {})

        const disposable = notify.on(cb)

        notify.getNotifiers()('info')
        expect(cb).toBeCalledWith('info')

        expect(notify['events'!].size).toEqual(1)
        disposable()
        expect(notify['events'!].size).toEqual(0)

        notify.getNotifiers()('info')
        expect(cb).toBeCalledWith('info')
    })
})
