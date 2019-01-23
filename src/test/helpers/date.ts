export const stubDate = fixedDate => {
  let originalDate;

  beforeAll(() => {
    originalDate = Date;

    global.Date = jest.fn(() => fixedDate);
  });

  afterAll(() => {
    global.Date = originalDate;
  });
};
