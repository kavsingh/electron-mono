export const uniqueBy = <T>(
  predicate: (a: Readonly<T>, b: Readonly<T>) => boolean,
  xs: readonly T[]
): T[] =>
  xs.reduce((acc: T[], x) => {
    if (!acc.some((item) => predicate(x, item))) acc.push(x);

    return acc;
  }, []);
