@admin @cw @writer @test
Feature: Casework portal user management

  Scenario: Admin user can view the User list and user details page
    Given the user navigates to casework user management page
    Then the user should see Admin page
    When the user navigates to the "Manage users" page
    Then the user should see Users page
    When the user navigate to the User details page
    Then the user should see correct user details

  Scenario: Admin user can edit users app roles
    Given the user navigates to casework user management page
    Then the user should see Admin page
    When the user navigates to the "Manage users" page
    And the user navigate to the User details page
    Then the user capture the displayed app roles
    And the user click the "Edit roles" link
    Then the user should see User roles page
    And the user should be same as pre-seleted
    And the user should see same app roles pre-selected

  Scenario: Admin user can manage app roles
    Given the user navigates to casework user management page
    Then the user should see Admin page
    When the user navigates to the "Manage users" page
