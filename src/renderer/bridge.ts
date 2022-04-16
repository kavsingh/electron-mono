// exports the bridge
// eslint-disable-next-line no-restricted-properties
const bridge: AppBridge = window.bridge;

export default bridge;

export type AppBridge = Window["bridge"];
