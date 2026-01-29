@e2e @flying-pigs @caseworker @happy-path @grantsui
Feature: Processing a Flying Pigs grant application

  As a caseworker
  I want to review and process a submitted Flying Pigs grant application
  So that I can move it through to the Contracted stage

  @grantsui
  Scenario: Review and approve a Flying Pigs grant application
    Given a Flying Pigs application has been submitted by an applicant
    And I am signed in as a caseworker
    When I navigate to the Cases page
    Then I should see the submitted application listed

    When I open the submitted application
    And I view the Case Details
    Then I should see the answers submitted by the applicant

    When I complete the "Review application data" task
    Then the timeline should show the latest item "Task 'Review application data' completed"

    When I approve the application for assessment
    Then the case stage should be "Assessment"
    And the timeline should show the latest item "Case approved"

    When I view the tasks for the case
    Then I should see the following task sections:
      | Check Application   |
      | Registration Checks |
      | Review available area checks |
      | Review intersecting data layers |

    When I complete all of the following tasks:
      | Check application and documents          |
      | Check on Find farm and land payment data |
      | Check on RPS (Dual Funding)              |
      | Confirm farm has a CPH                   |
      | Confirm APHA registration                |
      | SFI available area check 1               |
      | SFI available area check 2               |
      | Confirm available area check             |
      | SFI intersecting layers check 1          |
      | SFI intersecting layers check 2          |
      | Confirm available area check             |


    Then all tasks should have status "Complete"
    When I confirm the decision as approval of the application
    Then the case stage should be "Contracted"
    And I should see a confirmation of successful approval
    And the timeline should show:
      | Task 'Check application and documents' completed | 1 |
      | Task 'Check on Find farm and land payment data' completed | 1 |
      | Task 'Check on RPS (Dual Funding)' completed | 1 |
      | Task 'Confirm farm has a CPH' completed | 1 |
      | Task 'Confirm APHA registration' completed | 1 |
      | Task 'SFI available area check 1' completed | 1 |
      | Task 'SFI available area check 2' completed | 1 |
      | Task 'Confirm available area check' completed | 2 |
      | Task 'SFI intersecting layers check 1' completed | 1 |
      | Task 'SFI intersecting layers check 2' completed | 1 |
      | Task 'Review application data' completed | 1 |
      | Stage 'Application Received' outcome (approve) | 1 |
      | Stage 'Assessment' outcome (approve) | 1 |
