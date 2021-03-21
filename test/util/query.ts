export const getText = (
  elementQuery: Promise<WebdriverIO.Element>
): Promise<string> => elementQuery.then((el) => el.getText());
