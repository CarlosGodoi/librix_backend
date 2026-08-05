interface IParsePaginationResult {
  skip: number;
  take: number;
}

export function parsePagination(
  skip: string | undefined,
  take: string | undefined,
  defaults: { skip: number; take: number } = { skip: 0, take: 10 },
): IParsePaginationResult | null {
  const parsedSkip = skip ? Number(skip) : defaults.skip;
  const parsedTake = take ? Number(take) : defaults.take;

  if (Number.isNaN(parsedSkip) || Number.isNaN(parsedTake) || parsedSkip < 0 || parsedTake <= 0) {
    return null;
  }

  return { skip: parsedSkip, take: parsedTake };
}
