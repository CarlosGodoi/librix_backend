export const Pagination = (skip: number, take: number) => {
  const calcSkip = (skip - 1) * take;

  const pagination = {
    skip: calcSkip < 0 ? 0 : calcSkip,
    take,
  };

  return pagination;
};
