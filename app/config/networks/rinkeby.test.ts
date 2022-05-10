import rinkeby from "./rinkeby";

test("rinkeby has contracts", () => {
  expect(Object.keys(rinkeby.Contracts).length > 0).to.equal(true);
});
