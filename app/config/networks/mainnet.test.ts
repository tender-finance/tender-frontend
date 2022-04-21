import mainnet from "./mainnet";
test("mainnet has contracts", () => {
  expect(Object.keys(mainnet.Contracts).length > 0).to.equal(true);
});
