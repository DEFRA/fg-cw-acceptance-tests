@land-funding @happy-path
Feature: Land Funding Application

  As a farmer
  I want to apply for land funding
  So that I can receive funding for my land management actions

  Scenario: Complete land funding application journey
    Given a Land Funding application has been submitted by an applicant
    Then the user should see the land funding application confirmation page with reference number
    And the reference number should be in the format "XXX-XXX-XXX"
    And I am signed in as a caseworker
    When I navigate to the Cases page
    Then I should see the submitted application listed

    When I open the submitted application
    And I view the Case Details
    Then I should see the answers submitted by the applicant

    # When I accept the application for assessment
    # Then the case stage should be updated to "Assessment"
    # And I should see the following task sections:
    #   | Check Application   |
    #   | Registration Checks |

    # When I complete the task "Check application and documents"
    # And I complete the task "Check on Find farm and land payment data"
    # And I complete the task "Check on RPS (Dual Funding)"
    # And I complete the task "Confirm farm has a CPH"
    # And I complete the task "Confirm APHA registration"
    # Then all tasks should show status "Complete"

    # When I approve the application
    # Then the case stage should be updated to "Contracted"
    # And I should see a confirmation of successful approval

