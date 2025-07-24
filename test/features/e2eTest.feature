@wip
Feature: Flying Pigs Grant Application E2E Test

  Scenario: Complete pig farmer grant application journey
    Given the user is on grants UI and starts the application at "flying-pigs/start"
    When the user submits the answers
    And the user submits the application
    Then the user should see the confirmation page with reference number
    When the user navigates to the cases page
    Then the user should see the submitted application in the cases table
    And the user clicks on the reference number to open the application