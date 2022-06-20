describe("smoke tests", () => {
  it("should load app", () => {
    cy.visit("/");
    cy.findByTestId("app-frame");
  });
});

export {};
