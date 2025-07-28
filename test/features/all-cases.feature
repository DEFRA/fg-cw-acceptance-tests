@cw
Feature: Caseworkers can view and manage applications from the All Cases page

  @accessibility
  Scenario: User can view a submitted application on the Casework Portal
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user is navigate to "/cases" page
    And the user opens the application from the "All cases" list
    Then the user should see the submitted application information

  @accessibility
  Scenario: Application submitted data should be same on Casework Portal
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user is navigate to "/cases" page
    When the user opens the application from the "All cases" list
    And the user Approve the application
    Then the user should see application is successfully approved

  @test
  Scenario: Admin user can Assign a case to users
    Given the user has submitted an application for the "frps-private-beta" grant
    And the user is navigate to "/cases" page
    When the user selects newly created case
    And clicks the "Assign" button
    Then the "Assign" page should be displayed
    When the user selects a random case worker
    And clicks the "Assign" button
    Then the user should see a success message confirming case assignment
    And the selected case should be assigned to the chosen case worker
