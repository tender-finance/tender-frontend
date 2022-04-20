import faker from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    // TODO: adapt for metamask wallet
    // cy.cleanupUser();
  });

  it("should allow you to enter app", () => {
    cy.visit("/");
    cy.findByTestId("enter-app").click();
  });
});
