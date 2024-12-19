/* eslint-disable */
// @ts-nocheck sketch of desired api

// #main

import { ipcMain } from "electron";

const { tipcMain, createTipcMainRouter } =
    createTipcMain(ipcMain, { serializer, logger, scope });

const routes = {
    getFoo: tipcMain.queryHandler<TReturn, TInput>((ipcEvent, input) => {
        return "foo";
    }),
    
    setFoo: tipcMain.mutationHandler<TReturn, TInput>((ipcEvent, input) => {
        something = arg;

        return something;
    }),

    fooEvents: tipcMain.sender<TPayload>(({ send, sendToFrame }) => {
        const unsub1 = someEvents.subscribe("event1", (event) => {
            send(event);
        });
        
        const unsub2 = someEvents.subscribe("event2", (event) => {
            send(event, [browserWindow]);
        });
        
        const unsub3 = someEvents.subscribe("event3", (event) => {
            sendToFrame(event, [frame], [browserWindow]);
        });

        return function unsubscribe() {
            unsub1();
            unsub2();
            unsub3();
        }
    }),

    barEvents: tipcMain.subscriber<TPayload>((ipcEvent, payload) => {
        doSomething(payload)
    })
} as const;

const router = createTipcMainRouter(routes);

type Router = typeof router;



// #renderer

const tipcRenderer = createTipcRenderer<Router>({ serializer, logger, scope });

const foo = await tipcRenderer.getFoo.query();

const bar = await tipcRenderer.setFoo.mutate("foo");

const unsub = tipcRenderer.fooEvents.subscribe((ipcEvent, payload) => {
    doSomething(payload);
});

tipcRenderer.barEvents.send(payload);

tipcRenderer.barEvents.sendToHost(payload);



// #testing - renderer

const { createTipcBaseMocks, applyTipcMocks, tipcEmit } = mockTipc<Router>(scope);

// __mocks__/tipc
createTipcBaseMocks({
    getFoo: { query: mockFn(() => Promise.resolve("foo"))},
    setFoo: { mutate: mockFn(() => Promise.resolve()) },
    barEvents: { send: mockFn(), sendToHost: mockFn() },
});

it("should x", () => {
    applyTipcMocks({
        getFoo: { query: mockFn(() => Promise.reject(new Error()))},
    });
    
    act(() => {
        tipcEmit("fooEvents", payload);
    });

    expect(tipc.setFoo.mutate).toHaveBeenCalled();
    expect(tipc.barEvents.send).toHaveBeenCalled();
})



