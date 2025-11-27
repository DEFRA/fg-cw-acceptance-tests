@cw @admin
Feature: Caseworkers can view and manage applications from the All Cases page

  @accessibility
  Scenario: User can view a submitted application on the Casework Portal
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
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

  @assignUser @test
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
    Then the user remain on the Notes page with a "You must add a note" error message displayed
    When the user enters random text into the Add Notes field
    And the user click the "Save" button
    Then user should see a note of type "General"

  #Agreement generating
  @agreements
  Scenario: User can view Agreements details after the case is approved
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    Then the user should see below "frps-private-beta" tasks details
      | Check Customer Details                   | Incomplete |
      | Land parcel rules checks                 | Incomplete |
      | Check if SSSI consent has been requested | Incomplete |
      | Check Payment Amount                     | Incomplete |
      | Review Scheme Budget                     | Incomplete |
    When the user click the "Start Review" button
    And the user complete "Check Customer Details" task
    And the user complete "Land parcel rules checks" task
    And the user complete "Check if SSSI consent has been requested" task
    And the user complete "Check Payment Amount" task
    And the user complete "Review Scheme Budget" task
    And the user click the "Back to cases" link
    Then the case status should be "In review"
    When the user opens the application from the "All cases" list
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    Then the user should see below "frps-private-beta" tasks details
      | Check Customer Details                   | Complete |
      | Land parcel rules checks                 | Complete |
      | Check if SSSI consent has been requested | Complete |
      | Check Payment Amount                     | Complete |
      | Review Scheme Budget                     | Complete |
    And the user click the "Back to cases" link
    Then the case status should be "Agreement generating"
    When the user opens the application from the "All cases" list
    Then the user should see "Agreements" tab
    When the user click the "Agreements" link
    Then the user should see Agreements page is displayed
    And the user should see case agreements details
      | Reference | Date  | View     | Status  |
      | REFERENCE | TODAY | Internal | Offered |
    When the user click the "Back to cases" link
    Then the case status should be "Review offer"


  @agreements
  Scenario: User can view Agreements details after the case is approved
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    Then the user should see below "frps-private-beta" tasks details
      | Check Customer Details                   | Incomplete |
      | Land parcel rules checks                 | Incomplete |
      | Check if SSSI consent has been requested | Incomplete |
      | Check Payment Amount                     | Incomplete |
      | Review Scheme Budget                     | Incomplete |
    When the user click the "Start Review" button
    When the user select "Accepted" to complete "Check Customer Details" task
    When the user select "Accepted" to complete "Land parcel rules checks" task
    When the user select "Accepted" to complete "Check if SSSI consent has been requested" task
    When the user select "Accepted" to complete "Check Payment Amount" task
    When the user select "Accepted" to complete "Review Scheme Budget" task
    And the user click the "Back to cases" link
    Then the case status should be "In review"
    When the user opens the application from the "All cases" list
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    Then the user should see below "frps-private-beta" tasks details
      | Check Customer Details                   | Complete |
      | Land parcel rules checks                 | Complete |
      | Check if SSSI consent has been requested | Complete |
      | Check Payment Amount                     | Complete |
      | Review Scheme Budget                     | Complete |
    Then the user should see "Agreements" tab
    When the user select "Confirm" to complete "Check draft funding agreement" task
    When the user select "Confirm" to complete "Notify customer that draft agreement is ready" task
    And the user selects "Agreement sent" for the case
    When the user click the "Confirm" button
    When the user click the "Back to cases" link
    Then the case status should be "Agreement offer made"


  @case-status
  Scenario: Reject decision is no longer available when the case is ON_HOLD in the REVIEW_APPLICATION stage
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Start Review" button
    And the user selects "Put on hold" for the case with a comment
    And the user click the "Confirm" button
    And the user click the "Back to cases" link
    Then the case status should be "On hold"
    When the user opens the application from the "All cases" list
    And the user click "Resume" the case with a comment
    And the user click the "Back to cases" link
    Then the case status should be "In review"

  Scenario: User can view a submitted application on the Casework Portal
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
    And the user opens the application from the "All cases" list
    When the user click the "Check Customer Details" link
    Then user should see a message indicating that the task cannot be started



