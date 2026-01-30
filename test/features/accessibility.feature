@cw @assignUser @reader @accessibility
Feature: Caseworkers can view and manage applications from the All Cases page

  @cw @assignUser @reader @accessibility
  Scenario: Accessibility -Admin user can Assign a case to users and add notes
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user selects newly created case
    And the user click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And the user enters random text into the Assign case Notes field
    And the user click the "Assign" button
    Then the user should see a success message confirming case assignment
    And the selected case should be assigned to the chosen case worker

  