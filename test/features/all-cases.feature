@cw @reader
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

  @assignUser @accessibility
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
    And the user select "Accept" to complete "Check customer details" task
    And the user select "Accept" to complete "Review land parcel rule checks" task
    And the user select "Accept" to complete "Check if any land parcels are within an SSSI" task
    And the user select "Accept" to complete "Check payment amount" task
    And the user select "Accept" to complete "Review scheme budget as a finance officer" task
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
  Scenario: User can view Agreements details after the case task are is Accepted
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
    When the user select "Accept" to complete "Check customer details" task
    When the user select "Accept" to complete "Review land parcel rule checks" task
    When the user select "Accept" to complete "Check if any land parcels are within an SSSI" task
    When the user select "Accept" to complete "Check payment amount" task
    When the user select "Accept" to complete "Review scheme budget as a finance officer" task
    And the user click the "Back to applications" link
    Then the case status should be "In review"
    When the user opens the application from the "All cases" list
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    Then the user should see below "frps-private-beta" tasks details
      | Check customer details                       | Accepted |
      | Review land parcel rule checks               | Accepted |
      | Check if any land parcels are within an SSSI | Accepted |
      | Check payment amount                         | Accepted |
      | Review scheme budget as a finance officer    | Accepted |
    And the user click the "Back to applications" link
    And the user waits for the case status to be updated
    Then the case status should be "Agreement drafted"
    When the user opens the application from the "All cases" list
    Then the user should see "Agreements" tab
    When the user click the "Agreements" link
    Then the user should see Agreements page is displayed
    And the user should see case agreements details
      | Agreement status | Reference    | Date created | Date accepted | Start date  | View           |
      | Offered          | SFI843094265 | Date         | Not accepted  | Not started | View agreement |
    When the user click the "Back to applications" link
    And the user waits for the case status to be updated
    Then the case status should be "Agreement drafted"

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
    When the user select "Accept" to complete "Check customer details" task
    When the user select "Accept" to complete "Review land parcel rule checks" task
    When the user select "Accept" to complete "Check if any land parcels are within an SSSI" task
    When the user select "Accept" to complete "Check payment amount" task
    When the user select "Accept" to complete "Review scheme budget as a finance officer" task
    And the user click the "Back to applications" link
    Then the case status should be "In review"
    When the user opens the application from the "All cases" list
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    Then the user should see below "frps-private-beta" tasks details
      | Check customer details                       | Accepted |
      | Review land parcel rule checks               | Accepted |
      | Check if any land parcels are within an SSSI | Accepted |
      | Check payment amount                         | Accepted |
      | Review scheme budget as a finance officer    | Accepted |
    Then the user should see "Agreements" tab
    When the user select "Confirm" to complete "Check draft funding agreement" task
    When the user select "Confirm" to complete "Notify customer that agreement is ready" task
    Then the user should see below "frps-private-beta" tasks details
      | Check draft funding agreement           | Confirmed |
      | Notify customer that agreement is ready | Confirmed |
    And the user selects "Agreement sent" for the case
    When the user click the "Confirm" button
    Then the user should see "Customer Agreement Review" message
    When the user click the "Back to applications" link
    And the user waits for the case status to be updated
    Then the case status should be "Agreement offered"

  @case-status
  Scenario: Reject decision is no longer available when the case is ON_HOLD in the REVIEW_APPLICATION stage
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Start" button
    And the user selects "Put on hold" for the case with a comment
    And the user click the "Confirm" button
    And the user click the "Back to applications" link
    And the user waits for the case status to be updated
    Then the case status should be "On hold"
    When the user opens the application from the "All cases" list
    And the user click "Resume" the case with a comment
    And the user click the "Back to applications" link
    And the user waits for the case status to be updated
    Then the case status should be "In review"

  @case-status @reject
  Scenario: User can Reject and reinstate a case and status should update accordingly
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Start" button
    And the user selects "Reject Application" for the case with a comment
    And the user click the "Confirm" button
    And the user click the "Back to applications" link
    And the user waits for the case status to be updated
    Then the case status should be "Rejected"
    When the user opens the application from the "All cases" list
    And the user click "Reinstate Application" the case with a comment
    And the user click the "Back to applications" link
    And the user waits for the case status to be updated
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
    When the user select "Accept" to complete "Check customer details" task
    When the user select "Accept" to complete "Review land parcel rule checks" task
    When the user select "Accept" to complete "Check if any land parcels are within an SSSI" task
    When the user select "Accept" to complete "Check payment amount" task
    When the user select "Accept" to complete "Review scheme budget as a finance officer" task
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

  Scenario: Task remains incomplete unless the user selects Accept
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    When the user click the "Start" button
    And the user select "Request information from customer" to complete "Check customer details" task
    And the user select "Pause for internal investigation" to complete "Review land parcel rule checks" task
    And the user select "Cannot complete" to complete "Check if any land parcels are within an SSSI" task
    And the user select "Accept" to complete "Check payment amount" task
    And the user select "Accept" to complete "Review scheme budget as a finance officer" task
    Then the user should see below "frps-private-beta" tasks details
      | Check customer details                       | Information requested  |
      | Review land parcel rule checks               | Internal investigation |
      | Check if any land parcels are within an SSSI | Cannot complete        |
      | Check payment amount                         | Accepted               |
      | Review scheme budget as a finance officer    | Accepted               |

  @withdrawn @timeline
  Scenario: Casework can withdrawn application pre-agreement
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    And the user click the "Start" button
    And the user selects "Withdraw application" for the case with a comment
    And the user click the "Confirm" button
    And the user click the "Back to applications" link
    Then the case status should be "Withdrawn"
    When the user opens the application from the "All cases" list
    When the user click the "Timeline" link
    Then the Timeline should display these messages
      | Case received                    |
      | Stage 'Tasks' outcome (Withdraw) |
      | Status changed to 'Withdrawn'    |


  @withdrawn
  Scenario: Casework can withdrawn application post-agreement
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    And the user click the "Start" button
    When the user select "Accept" to complete "Check customer details" task
    When the user select "Accept" to complete "Review land parcel rule checks" task
    When the user select "Accept" to complete "Check if any land parcels are within an SSSI" task
    When the user select "Accept" to complete "Check payment amount" task
    When the user select "Accept" to complete "Review scheme budget as a finance officer" task
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    Then the user should see "Agreements" tab
    And the user selects "Withdraw application" for the case with a comment
    And the user click the "Confirm" button
    When the user click the "Agreements" link
    And the user waits until the agreements message "Withdrawn" is displayed
    And the user waits for the agreements message
    And the user should see case agreements details
      | Agreement status | Reference    | Date created | Date accepted | Start date  | View           |
      | Withdrawn        | SFI843094265 | Date         | Not accepted  | Not started | View agreement |
    And the user click the "Back to applications" link
    And the user waits for the case status to be updated
    Then the case status should be "Withdrawn"

  @taskNotes
  Scenario: User cannot continue without adding Notes on Task Options
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    And the user opens the application from the "All cases" list
    And the user click the "Start" button
    When the user clicks Confirm on the task without notes and sees "Explain this outcome is required"
      | Check customer details                       |
      | Review land parcel rule checks               |
      | Check if any land parcels are within an SSSI |
      | Check payment amount                         |
      | Review scheme budget as a finance officer    |


    Scenario: User can view and run Land parcel calculations
      Given the user has submitted an application for the "frps-private-beta" grant
      When the user waits for the case to appear on the Casework Portal
      And the user opens the application from the "All cases" list
      And the user click the "Calculations" link
  #defect raised
#      Then the user can view Land parcel calculations page

