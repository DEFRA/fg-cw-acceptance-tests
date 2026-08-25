@e2e @flying-pigs @caseworker @happy-path @grantsui @test
Feature: Processing a Flying Pigs grant application

  As a caseworker
  I want to review and process a submitted Flying Pigs grant application
  So that I can move it through to the Contracted stage

  @grantsui @writer
  Scenario: Review and approve a Flying Pigs grant application
    Given a Flying Pigs application has been submitted by an applicant

    And the user signed into Caseworking as a writer
    Then I should see the submitted application listed

    When I open the submitted application
    And I view the Case Details
    Then I should see the answers submitted by the applicant


    When the user click the "Tasks" link
    And the user click the "Start" button

    #Pig stock review tasks
    When the user select "Accept" to complete "Verify pig farmer status" task
    When the user select "Accept" to complete "Check pig stock numbers" task
    When the user select "Accept" to complete "Check number of White Pigs" task


   #Reference capture tasks
    When the user enter "1234566" to complete "Capture Siti/FC reference" task
    When the user enter "4999" to complete "Capture herd size" task
    When the user enter "28/09/2026" to complete "Capture inspection date" task


    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" link

    Then the user should see "Agreements" tab
    When the user select "Sent to customer" to complete "Notify customer that draft agreement is ready" task

    And the user selects "Agreement sent" for the case
    When the user click the "Confirm" button
    Then the user should see "Agreement with applicant" message

    ### Accept the agreement
    When the user accept the agreement

    And the user navigates to the cases page
    When the user opens the the case from cases page

    And the user refresh the browser
    Then the user should see "Monitoring" Page
    Then the case status on task should be "Agreement accepted"

    When the user click the "Agreements" link
    And the user should see case agreements details
      | Agreement status | Reference    | Date created | Date accepted | Start date | End date | View           |
      | Accepted         | PMF623183602 | DATE         | DATE          | DATE       | DATE       | View agreement |


    When the user click the "Timeline" link
    Then the Timeline should display these messages
      | Case received                               |
      | Stage 'Tasks' outcome (Start)               |
      | Task 'Verify pig farmer status' completed   |
      | Task 'Check pig stock numbers' completed    |
      | Task 'Check number of White Pigs' completed |
      | Stage 'Tasks' outcome (Approve)             |

    ### terminate the application
    When the user click the "Tasks" link
    And the user enter "INITIATE TERMINATION" comment
    And the user click the "Terminate" button

    Then the case status on task should be "Preparing to terminate"
    When the user select "Confirm" to complete "Notify Agreement Holder of agreement termination" task
    And the user click the "Confirm" link

    And the user selects "Terminate agreement" for the case with a comment
    And the user click the "Confirm" link

    When the user select the "Yes" radio button
    And the user click the "Confirm" link

    And the user refresh the browser
    And the user refresh the browser
    Then the case status on task should be "Terminated"


  Scenario: Withdraw PMF applicatio
    Given a Flying Pigs application has been submitted by an applicant

    And the user signed into Caseworking as a writer
    Then I should see the submitted application listed

    When I open the submitted application
    And I view the Case Details
    Then I should see the answers submitted by the applicant


    When the user click the "Tasks" link
    And the user click the "Start" button

    #Pig stock review tasks
    When the user select "Accept" to complete "Verify pig farmer status" task
    When the user select "Accept" to complete "Check pig stock numbers" task
    When the user select "Accept" to complete "Check number of White Pigs" task


   #Reference capture tasks
    When the user enter "1234566" to complete "Capture Siti/FC reference" task
    When the user enter "4999" to complete "Capture herd size" task
    When the user enter "28/09/2026" to complete "Capture inspection date" task


    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" link

    Then the user should see "Agreements" tab
    When the user select "Sent to customer" to complete "Notify customer that draft agreement is ready" task


    And the user refresh the browser
    Then the case status on task should be "Agreement ready for applicant"

    And the user selects "WITHDRAW APPLICATION" for the case with a comment
    When the user click the "Confirm" button

    And the user refresh the browser
    And the user refresh the browser
    Then the case status on task should be "Withdrawn"
