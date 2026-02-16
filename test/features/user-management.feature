@admin @cw @writer
Feature: Casework portal user management

  Scenario: Admin user can view the User list and user details page
    Given the user navigates to casework user management page
    Then the user should see Admin page
    When the user opens the "Manage users" page
    Then the user should see Users page
    When the user navigate to the User details page
    Then the user should see correct user details

  Scenario: User app roles should display what selected on user roles page
    Given the user navigates to casework user management page
    Then the user should see Admin page
    When the user opens the "Manage users" page
    When the user navigate to the User details page
    And the user capture the displayed app roles
    And the user click the "Update roles" link
    Then the user should see User roles page
    And the user should be same as pre-selected
    And the user should see same app roles pre-selected

  Scenario: Admin user can create new roles - Valid data
    Given the user navigates to casework user management page
    Then the user should see Admin page
    When the user opens the "Manage roles" page
    Then the user should see Roles page
    When the user click the "Create role" link
    Then the user should see Create Role page
    When the user create a new role with random data
    Then the role should be created successfully

  Scenario: Can't create a role with incorrect or blank data
    Given the user navigates to casework user management page
    Then the user should see Admin page
    When the user opens the "Manage roles" page
    Then the user should see Roles page
    When the user click the "Create role" link
    Then the user click the "Confirm" button
    Then the user remain on the page with a "Enter a role code" error message displayed
    Then the user remain on the page with a "Enter a role description" error message displayed
    Then the user remain on the page with a "Select whether the role is assignable" error message displayed
    When the user create a new role with incorrect code
    Then the user remain on the page with a "Code can only contain letters, numbers and '_' (underscores)" error message displayed
    Then the user remain on the page with a "Code cannot start with '_' (underscore)." error message displayed

  @newuser
  Scenario: Admin user cannot create new user with incorrect or blank data
    Given the user navigates to casework user management page
    Then the user should see Admin page
    When the user opens the "Manage users" page
    And the user click the "Create user" link
    Then the user should see Create user page
    When the user click the "Confirm" button
    Then the user remain on the page with a "Enter a name" error message displayed
    Then the user remain on the page with a "Enter an email address" error message displayed

  @editRole
  Scenario: Admin user can update role description and description should be mandatory
    Given the user navigates to casework user management page
    Then the user should see Admin page
    When the user opens the "Manage roles" page
    And the user selects a random role
    Then the user should be on the edit role page
    When the user clear the edit role description value
    When the user click the "Confirm" button
    Then the user remain on the page with a "Enter a role description" error message displayed
    When the user updates the role description with a random value
    Then the user should see previously selected role description updated correctly

  @editRole
  Scenario: Admin user can change a role to not assignable and the change is reflected on Manage users roles page
    Given the user navigates to casework user management page
    Then the user should see Admin page

    When the user opens the "Manage roles" page
    And the user selects a random assignable role
    Then the user should be on the edit role page

    When the user sets "Allow this role to be assigned?" to "No"
    And the user click the "Confirm" button
    Then the selected role should show "No" in the Assignable column

    When the user navigates to casework user management page
    And the user opens the "Manage users" page
    And the user navigate to the User details page
    And the user click the "Update roles" link

    Then the role should not be available for assignment

    When the user navigates to casework user management page
    Then the role is reverted back to assignable



