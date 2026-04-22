@e2e @flying-pigs @caseworker @happy-path @grantsui
Feature: Processing a Flying Pigs grant application

  As a caseworker
  I want to review and process a submitted Flying Pigs grant application
  So that I can move it through to the Contracted stage

  @grantsui @writer @test
  Scenario: Review and approve a Flying Pigs grant application
    Given a Flying Pigs application has been submitted by an applicant

    And the user signed into Caseworking as a writer
    Then I should see the submitted application listed

    When I open the submitted application
    And I view the Case Details
    Then I should see the answers submitted by the applicant

    When the user click the "Tasks" link
    And the user click the "Start" button
    When the user select "Accept" to complete "Verify pig farmer status" task
    When the user select "Accept" to complete "Check pig stock numbers" task
    When the user select "Accept" to complete "Check number of White Pigs" task

    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" link

    Then the user should see "Final Approval" Page
    When the user click the "Timeline" link
    Then the Timeline should display these messages
      | Case received                               |
      | Stage 'Tasks' outcome (Start)               |
      | Task 'Verify pig farmer status' completed   |
      | Task 'Check pig stock numbers' completed    |
      | Task 'Check number of White Pigs' completed |
      | Stage 'Tasks' outcome (Approve)             |

