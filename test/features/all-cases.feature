Feature: Caseworkers can view and manage applications from the All Cases page

  Scenario: User can view a submitted application on the Casework Portal
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user is navigate to "/cases" page
    And the user opens the application from the "All cases" list
    Then the user should see the submitted application information


