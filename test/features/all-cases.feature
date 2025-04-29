Feature: Casework can visit all cases page and perform the activities

  Scenario: User can view submitted application on case work portal
    Given user submitted a application for "frps-private-beta" grant
    When user is navigate to /applications page
    And user open the application from All cases
    Then user should the application information


