describe("spenn application", () => {
  it("can edit hours, rates and calculate the correct amount of income", () => {
    cy.intercept("GET", "/api/get*", {
      body: {},
    }).as("getState");
    cy.intercept("POST", "/api/post", {}).as("postState");

    cy.visit("/");

    cy.get("#edit-rates-summary").click();
    cy.clearAndSetValue("#edit-rates-input-weekday", "1309");
    cy.clearAndSetValue("#edit-rates-input-saturday", "1309");
    cy.clearAndSetValue("#edit-rates-input-sunday", "1309");
    cy.clearAndSetValue("#edit-rates-input-cut", "60");
    cy.clearAndSetValue("#edit-rates-input-pension", "5");
    cy.clearAndSetValue("#edit-rates-input-holiday", "12");
    cy.clearAndSetValue("#edit-rates-input-aga", "14.1");
    cy.clearAndSetValue("#edit-rates-input-tax", "42");
    cy.get("#edit-rates-summary").click();

    // Enter hours
    cy.get("#date-input-12").type("1");
    cy.get("#date-input-13").type("f");
    cy.get("#date-input-13").should("have.value", "7.5");
    cy.get("#date-input-13").type("d");
    cy.get("#date-input-13").should("have.value", "0");
    cy.get("#date-input-10").type("f");

    // Verify money
    cy.get("#toggle-view-income").click();
    cy.get("#date-input-12").should("have.value", "347");
    cy.get("#date-input-13").should("have.value", "0");
    cy.get("#date-input-10").should("have.value", "2608");

    // Verify filter hotkeys
    cy.document().trigger("keypress", { key: "h" });
    cy.get("#toggle-view-hours").should("have.class", "project-button-active");
    cy.get("#date-input-12").should("have.value", "1");
    cy.get("#date-input-13").should("have.value", "0");
    cy.get("#date-input-10").should("have.value", "7.5");

    // Trigger income filter
    cy.document().trigger("keypress", { key: "m" });
    cy.get("#toggle-view-income").should("have.class", "project-button-active");
    cy.get("#date-input-12").should("have.value", "347");
    cy.get("#date-input-13").should("have.value", "0");
    cy.get("#date-input-10").should("have.value", "2608");

    // Back to hours
    cy.document().trigger("keypress", { key: "h" });

    // Verify stats
    cy.get("#stats-summary").click();
    cy.get("#hours-project").should("have.text", "8.5");
    cy.get("#hours-combined").should("have.text", "8.5");
    cy.get("#income-project").contains("2 956,04 kr");
    cy.get("#income-combined").contains("2 956,04 kr");

    // Add new project and activate it
    cy.get("#add-project").type("Second project").type("{enter}");
    cy.get("#project-second-project").click();
    cy.get("#project-second-project").should(
      "have.class",
      "project-button-active",
    );

    // Verify that inputs aren't passing over from previous project
    cy.get("#date-input-12").should("have.value", "");
    cy.get("#date-input-13").should("have.value", "");
    cy.get("#date-input-10").should("have.value", "");

    // Check money as well
    cy.document().trigger("keypress", { key: "m" });
    cy.get("#date-input-12").should("have.value", "");
    cy.get("#date-input-13").should("have.value", "");
    cy.get("#date-input-10").should("have.value", "");

    // Add some data to different inputs
    cy.document().trigger("keypress", { key: "h" });
    cy.get("#date-input-7").type("f");
    cy.get("#date-input-7").should("have.value", "7.5");
    cy.get("#date-input-8").type("3").type("{enter}"); // Value doesn't update unless the input loses focus

    // Verify stats
    cy.get("#hours-project").should("have.text", "10.5");
    cy.get("#hours-combined").should("have.text", "19");
    cy.get("#income-project").contains("3 651,58 kr");
    cy.get("#income-combined").contains("6 607,62 kr");

    // Verify that first project is still correct
    // Verify money
    cy.get("#project-default").click();
    cy.get("#toggle-view-income").click();
    cy.get("#date-input-12").should("have.value", "347");
    cy.get("#date-input-13").should("have.value", ""); // Value is reset instead of 0
    cy.get("#date-input-10").should("have.value", "2608");

    // Verify hours
    cy.get("#toggle-view-hours").click();
    cy.get("#date-input-12").should("have.value", "1");
    cy.get("#date-input-13").should("have.value", "0");
    cy.get("#date-input-10").should("have.value", "7.5");

    // Verify stats
    cy.get("#hours-project").should("have.text", "8.5");
    cy.get("#hours-combined").should("have.text", "19");
    cy.get("#income-project").contains("2 956,04 kr");
    cy.get("#income-combined").contains("6 607,62 kr");

    // Changing rates should re-calculate incomes
    cy.get("#toggle-view-income").click();
    cy.get("#edit-rates-summary").click();
    cy.clearAndSetValue("#edit-rates-input-weekday", "100");
    cy.get("#edit-rates-summary").click();
    cy.get("#date-input-12").should("have.value", "347");
    cy.get("#date-input-10").should("have.value", "199");
    cy.get("#income-project").contains("547,03 kr");
    cy.get("#income-combined").contains("4 198,60 kr");

    // Changing rates for one project should not modify other projects rates
    cy.get("#project-second-project").click();
    cy.get("#edit-rates-input-weekday").should("have.value", "1309");

    // Modifying rates for second project does not modify first project
    cy.get("#edit-rates-summary").click();
    cy.clearAndSetValue("#edit-rates-input-weekday", "1337");
    cy.get("#edit-rates-input-weekday").should("have.value", "1337");
    cy.get("#project-default").click();
    cy.get("#edit-rates-input-weekday").should("have.value", "100");
  });
});
