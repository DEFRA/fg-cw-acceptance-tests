@e2e @flying-pigs @caseworker @happy-path @accessibility @grantsui
Feature: Processing a Flying Pigs grant application

  As a caseworker
  I want to review and process a submitted Flying Pigs grant application
  So that I can move it through to the Contracted stage

  @test1 @grantsui
  Scenario: Review and approve a Flying Pigs grant application
    Given a Flying Pigs application has been submitted by an applicant
    And I am signed in as a caseworker
    When I navigate to the Cases page
    Then I should see the submitted application listed

    When I open the submitted application
    And I view the Case Details
    Then I should see the answers submitted by the applicant

    When I complete the "Review application data" task
    Then the timeline should show the latest item "Task completed"

    When I accept the application for assessment
    Then the case stage should be "Assessment"
    And the timeline should show the latest item "Stage completed"

    When I view the tasks for the case
    Then I should see the following task sections:
      | Check Application   |
      | Registration Checks |

    When I complete all of the following tasks:
      | Check application and documents          |
      | Check on Find farm and land payment data |
      | Check on RPS (Dual Funding)              |
      | Confirm farm has a CPH                   |
      | Confirm APHA registration                |
    Then all tasks should have status "Complete"

    When I "Confirm Approval" the application
    Then the case stage should be "Contracted"
    And I should see a confirmation of successful approval
    And the timeline should show:
      | Task completed   | 6 |
      | Stage completed  | 2 |
