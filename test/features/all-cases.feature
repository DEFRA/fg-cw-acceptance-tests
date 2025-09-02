@cw
Feature: Caseworkers can view and manage applications from the All Cases page

  @accessibility
  Scenario: User can view a submitted application on the Casework Portal
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user navigates to the "/cases" page
    And the user opens the application from the "All cases" list
    Then the user should see the submitted application information
    And the user navigates to the "Timeline" section
    Then the Timeline should display these messages
      | Case received |

  @accessibility
  Scenario: Submitted application data should be the same on the Casework portal
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    When the user opens the application from the "All cases" list
    And the user Approve the application
    Then the user should see application is successfully approved

  @assignUser
  Scenario: Admin user can assign a case to users
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    When the user selects newly created case
    And the user click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And the user click the "Assign" button
    Then the user should see a success message confirming case assignment
    And the selected case should be assigned to the chosen case worker

  @assignUser
  Scenario: Admin user can Assign a case to users and add notes
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    When the user selects newly created case
    And the user click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And I enter random text into the notes field
    And the user click the "Assign" button
    Then the user should see a success message confirming case assignment
    And the selected case should be assigned to the chosen case worker

  @assignUser @timeline
  Scenario: User sees the ‘Case assigned’ message on the timeline and can view the notes
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    When the user selects newly created case
    And the user click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And I enter random text into the notes field
    And the user click the "Assign" button
    And the user opens the application from the "All cases" list
    And the user navigates to the "Timeline" section
    Then the Timeline should display these messages
      | Case assigned |
    When the user click the "View note" link
    #defect - FGP-549
#    Then the user can see the previously entered notes

  @assignUser @timeline
  Scenario: User sees the ‘Case unassigned’ message on the timeline and can view the notes
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    When the user selects newly created case
    And the user click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And I enter random text into the notes field
    And the user click the "Assign" button
    When the user selects newly created case
    And the user click the "Assign" button
    When the user select Unassigned from the user dropdown
    And the user click the "Assign" button
    Then the user should see a success message confirming case is unassigned
    And the selected case should be unassigned
    And the user opens the application from the "All cases" list
    And the user navigates to the "Timeline" section
    Then the Timeline should display these messages
      | Case unassigned |
    When the user click the "View note" link
    #defect - FGP-549
#    Then the user can see the previously entered notes

  @assignUser @timeline
  Scenario: User can add notes to the case
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user navigates to the "/cases" page
    And the user opens the application from the "All cases" list
    When the user click the "Notes" link
    And the user click the "Add note" link
    And the user click the "Save" button
    Then the user remain on the Notes page with a "You must enter a note" error message displayed
