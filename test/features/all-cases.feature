@cw @admin
Feature: Caseworkers can view and manage applications from the All Cases page

  @accessibility
  Scenario: User can view a submitted application on the Casework Portal
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "New"
    And the user opens the application from the "All cases" list
    Then the user should see the submitted application information
    And the user navigates to the "Timeline" section
    Then the Timeline should display these messages
      | Case received |

  @assignUser
  Scenario: Admin user can assign a case to users
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user selects newly created case
    And the user click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And the user click the "Assign" button
    Then the user should see a success message confirming case assignment
    And the selected case should be assigned to the chosen case worker

  @assignUser
  Scenario: Admin user can Assign a case to users and add notes
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

  @assignUser @timeline
  Scenario: User sees the ‘Case assigned’ message on the timeline and can view the notes
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user waits for the case to appear on the Casework Portal
    When the user selects newly created case
    And the user click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And the user enters random text into the Assign case Notes field
    And the user click the "Assign" button
    And the user opens the application from the "All cases" list
    And the user navigates to the "Timeline" section
    Then the Timeline should display these messages
      | Case assigned |
    When the user click the "View note" link
    Then user should see a note of type "Assignment"

  @assignUser @timeline
  Scenario: User sees the ‘Case unassigned’ message on the timeline and can view the notes
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user waits for the case to appear on the Casework Portal
    When the user selects newly created case
    And the user click the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And the user enters random text into the Assign case Notes field
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
    Then user should see a note of type "Assignment"

  @addnotes
  Scenario: User can add notes to the case
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Notes" link
    And the user click the "Add note" link
    And the user click the "Save" button
    Then the user remain on the Notes page with a "You must enter a note" error message displayed
    When the user enters random text into the Add Notes field
    And the user click the "Save" button
    Then user should see a note of type "General"

  @agreements
  Scenario: User can view Agreements details after the case is approved
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    Then the user should see below "frps-private-beta" tasks details
      | Simple Review | Incomplete |
    And the user complete "Simple Review" task
    And the user Approve the application with a comment
    And the user click the "Save" button
    Then the user should see application is successfully approved
    And the user should see "Agreements" tab
    When the user click the "Agreements" link
    Then the user should see Agreements page is displayed
    And the user should see case agreements details
      | Reference | Date  | View                   | Status  |
      | REFERENCE | TODAY | Internal Copy external | Offered |
    When the user click the "Back to cases" link
    Then the case status should be "Review"

