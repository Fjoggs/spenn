// cypress/support/index.ts
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      clearAndSetValue(
        id: string,
        value: string
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}
