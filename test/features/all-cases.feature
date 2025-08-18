@cw
Feature: Caseworkers can view and manage applications from the All Cases page

  @accessibility
  Scenario: User can view a submitted application on the Casework Portal
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user navigates to the "/cases" page
    And the user opens the application from the "All cases" list
    Then the user should see the submitted application information
    And user navigates to the "Timeline" section
    Then the Timeline should display these messages
      | Case received |

  @accessibility
  Scenario: Application submitted data should be same on Casework Portal
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    When the user opens the application from the "All cases" list
    And the user Approve the application
    Then the user should see application is successfully approved

  @assignUser
  Scenario: Admin user can Assign a case to users
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    When the user selects newly created case
    And click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And click the "Assign" button
    Then the user should see a success message confirming case assignment
    And the selected case should be assigned to the chosen case worker

  @assignUser
  Scenario: Admin user can Assign a case to users and add notes
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    When the user selects newly created case
    And click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And I enter random text into the notes field
    And click the "Assign" button
    Then the user should see a success message confirming case assignment
    And the selected case should be assigned to the chosen case worker

  @assignUser @timeline
  Scenario: User view case assigned message on timeline and view the notes
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    When the user selects newly created case
    And click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And I enter random text into the notes field
    And click the "Assign" button
    And the user opens the application from the "All cases" list
    And user navigates to the "Timeline" section
    Then the Timeline should display these messages
      | Case assigned |
    When click the "View note" link
    Then the user can see the previously entered notes

  @assignUser @timeline
  Scenario: User can add notes to the case
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    And the user opens the application from the "All cases" list
    When click the "Notes" link
    And click the "Add note" link
    And click the "Save" button
    Then I remain on the Notes page with a "You must enter a note" error message displayed
