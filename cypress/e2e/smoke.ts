describe("smoke tests", () => {
  it("should allow you to enter app", () => {
    cy.visit("/");
    cy.findByTestId("enter-app").click();
  });
});
