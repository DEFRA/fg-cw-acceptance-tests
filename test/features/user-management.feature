@admin
Feature: Casework portal user management

  Scenario: Admin user can view the User list and user details page
    Given the user navigates to casework user management page
    Then the user should see admin page
    When the user navigates to the "Manage users" page
    Then the user should see Users page
    When the user navigate to the user details page
    Then the user should see correct user details


