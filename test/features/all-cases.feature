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

  @agreements @timeline
  Scenario: User can see Timeline is updated with each action
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Start" button
    And the user select "Accepted" to complete "Check customer details" task
    And the user select "Accepted" to complete "Review land parcel rule checks" task
    And the user select "Accepted" to complete "Check if any land parcels are within an SSSI" task
    And the user select "Accepted" to complete "Check payment amount" task
    And the user select "Accepted" to complete "Review scheme budget as a finance officer" task
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    Then the user should see "Agreements" tab
    When the user select "Confirm" to complete "Check draft funding agreement" task
    And the user select "Confirm" to complete "Notify customer that agreement is ready" task
    And the user selects "Agreement sent" for the case
    When the user click the "Confirm" button
    Then the user should see "Customer Agreement Review" message
    When the user click the "Timeline" link
    Then the Timeline should display these messages
      | Case received                                                 |
      | Stage 'Tasks' outcome (Start)                                 |
      | Task 'Check customer details' completed                       |
      | Task 'Review land parcel rule checks' completed               |
      | Task 'Check if any land parcels are within an SSSI' completed |
      | Task 'Check payment amount' completed                         |
      | Task 'Review scheme budget as a finance officer' completed    |
      | Stage 'Tasks' outcome (Approve)                               |
      | Task 'Check draft funding agreement' completed                |
      | Task 'Notify customer that agreement is ready' completed      |
      | Stage 'Tasks' outcome (Agreement sent)                        |
      | Status changed to 'Review Offer'                              |
      | Stage 'Tasks' completed                                       |


  @addnotes
  Scenario: User can add notes to the case
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Notes" link
    And the user click the "Add note" link
    And the user click the "Save" button
    Then the user remain on the page with a "You must add a note" error message displayed
    When the user enters random text into the Add Notes field
    And the user click the "Save" button
    Then user should see a note of type "General"

  @agreements
  Scenario: User can view Agreements details after the case is approved
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    Then the user should see below "frps-private-beta" tasks details
      | Check customer details                       | Incomplete |
      | Review land parcel rule checks               | Incomplete |
      | Check if any land parcels are within an SSSI | Incomplete |
      | Check payment amount                         | Incomplete |
      | Review scheme budget as a finance officer    | Incomplete |
    When the user click the "Start" button
    When the user select "Accepted" to complete "Check customer details" task
    When the user select "Accepted" to complete "Review land parcel rule checks" task
    When the user select "Accepted" to complete "Check if any land parcels are within an SSSI" task
    When the user select "Accepted" to complete "Check payment amount" task
    When the user select "Accepted" to complete "Review scheme budget as a finance officer" task
    And the user click the "Back to applications" link
    Then the case status should be "In review"
    When the user opens the application from the "All cases" list
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    Then the user should see below "frps-private-beta" tasks details
      | Check customer details                       | Complete |
      | Review land parcel rule checks               | Complete |
      | Check if any land parcels are within an SSSI | Complete |
      | Check payment amount                         | Complete |
      | Review scheme budget as a finance officer    | Complete |
    And the user click the "Back to applications" link
    Then the case status should be "Agreement generating"
    When the user opens the application from the "All cases" list
    Then the user should see "Agreements" tab
    When the user click the "Agreements" link
    Then the user should see Agreements page is displayed
    And the user should see case agreements details
      | Reference | Date  | View     | Status  |
      | REFERENCE | TODAY | Internal | Offered |
    When the user click the "Back to applications" link
    Then the case status should be "Review offer"

  @agreements
  Scenario: User can view Agreements details after the case is approved
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    Then the user should see below "frps-private-beta" tasks details
      | Check customer details                       | Incomplete |
      | Review land parcel rule checks               | Incomplete |
      | Check if any land parcels are within an SSSI | Incomplete |
      | Check payment amount                         | Incomplete |
      | Review scheme budget as a finance officer    | Incomplete |
    When the user click the "Start" button
    When the user select "Accepted" to complete "Check customer details" task
    When the user select "Accepted" to complete "Review land parcel rule checks" task
    When the user select "Accepted" to complete "Check if any land parcels are within an SSSI" task
    When the user select "Accepted" to complete "Check payment amount" task
    When the user select "Accepted" to complete "Review scheme budget as a finance officer" task
    And the user click the "Back to applications" link
    Then the case status should be "In review"
    When the user opens the application from the "All cases" list
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    Then the user should see below "frps-private-beta" tasks details
      | Check customer details                       | Complete |
      | Review land parcel rule checks               | Complete |
      | Check if any land parcels are within an SSSI | Complete |
      | Check payment amount                         | Complete |
      | Review scheme budget as a finance officer    | Complete |
    Then the user should see "Agreements" tab
    When the user select "Confirm" to complete "Check draft funding agreement" task
    When the user select "Confirm" to complete "Notify customer that agreement is ready" task
    And the user selects "Agreement sent" for the case
    When the user click the "Confirm" button
    Then the user should see "Customer Agreement Review" message
    When the user click the "Back to applications" link
    Then the case status should be "Agreement offer made"

  @case-status
  Scenario: Reject decision is no longer available when the case is ON_HOLD in the REVIEW_APPLICATION stage
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Start" button
    And the user selects "Put on hold" for the case with a comment
    And the user click the "Confirm" button
    And the user click the "Back to applications" link
    Then the case status should be "On hold"
    When the user opens the application from the "All cases" list
    And the user click "Resume" the case with a comment
    And the user click the "Back to applications" link
    Then the case status should be "In review"

  Scenario:User cannot start task without clicking the start button
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
    And the user opens the application from the "All cases" list
    When the user click the "Check customer details" link
    Then user should not options to confirm the task

  Scenario: User cannot Confirm without select an option and comments
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Start" button
    And the user click the "Confirm" button
    Then the user remain on the page with a "Choose an option" error message displayed
    When the user selects "Reject Application" for the case
    And the user click the "Confirm" button
    Then the user remain on the page with a "Explain this decision is required" error message displayed
    When the user selects "Put on hold" for the case
    And the user click the "Confirm" button
    Then the user remain on the page with a "Explain this decision is required" error message displayed

  Scenario:User cannot continue without selecting the outcome on task page
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
    And the user opens the application from the "All cases" list
    When the user click the "Start" button
    And the user click the "Check customer details" link
    And the user click the "Confirm" button
    Then the user remain on the page with a "Choose an option" error message displayed
    And the user click the "Cancel and return" link
    When the user click the "Review land parcel rule checks" link
    And the user click the "Confirm" button
    Then the user remain on the page with a "Choose an option" error message displayed
    And the user click the "Cancel and return" link
    When the user click the "Check if any land parcels are within an SSSI" link
    And the user click the "Confirm" button
    Then the user remain on the page with a "Choose an option" error message displayed
    And the user click the "Cancel and return" link
    When the user click the "Check payment amount" link
    And the user click the "Confirm" button
    Then the user remain on the page with a "Choose an option" error message displayed
    And the user click the "Cancel and return" link
    When the user click the "Review scheme budget as a finance officer" link
    And the user click the "Confirm" button
    Then the user remain on the page with a "Choose an option" error message displayed

  Scenario:User cannot continue without selecting the outcome on Case stage page
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
    And the user opens the application from the "All cases" list
    When the user click the "Start" button

  Scenario: User cannot complete case review task without selecting any option
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Start" button
    When the user select "Accepted" to complete "Check customer details" task
    When the user select "Accepted" to complete "Review land parcel rule checks" task
    When the user select "Accepted" to complete "Check if any land parcels are within an SSSI" task
    When the user select "Accepted" to complete "Check payment amount" task
    When the user select "Accepted" to complete "Review scheme budget as a finance officer" task
    And the user click the "Confirm" button
    Then the user remain on the page with a "Choose an option" error message displayed
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    Then the user should see "Agreements" tab
    When the user click the "Check draft funding agreement" link
    And the user click the "Confirm" button
    Then the user remain on the page with a "Choose an option" error message displayed
    And the user click the "Cancel and return" link
    When the user click the "Notify customer that agreement is ready" link
    And the user click the "Confirm" button
    Then the user remain on the page with a "Choose an option" error message displayed






