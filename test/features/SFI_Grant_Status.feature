@cw @writer
Feature: SFI Grant Application status

  Scenario: Application cases status - New application - Reject - Withdrawn
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD            |
      | stage     | REVIEW_APPLICATION   |
      | status    | APPLICATION_RECEIVED |
      | clientRef | self                 |
      | grantCode | frps-private-beta    |
    And the user opens the application from the "All cases" list

    ### start the case
    And the user click the "Start" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD          |
      | stage     | REVIEW_APPLICATION |
      | status    | IN_REVIEW          |
      | clientRef | self               |
      | grantCode | frps-private-beta  |

    ## Reject the case
    And the user selects "Reject Application" for the case with a comment
    And the user click the "Confirm" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD            |
      | stage     | REVIEW_APPLICATION   |
      | status    | APPLICATION_REJECTED |
      | clientRef | self                 |
      | grantCode | frps-private-beta    |

    ## reinstate the application
    When the user click "Reinstate Application" with a comment
    And the user click the "Reinstate Application" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD          |
      | stage     | REVIEW_APPLICATION |
      | status    | IN_REVIEW          |
      | clientRef | self               |
      | grantCode | frps-private-beta  |


    ## On Hold the case
    And the user selects "Put on hold" for the case with a comment
    And the user click the "Confirm" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD          |
      | stage     | REVIEW_APPLICATION |
      | status    | ON_HOLD            |
      | clientRef | self               |
      | grantCode | frps-private-beta  |

    ## resume the application
    When the user click "Resume" with a comment
    And the user click the "Resume" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD          |
      | stage     | REVIEW_APPLICATION |
      | status    | IN_REVIEW          |
      | clientRef | self               |
      | grantCode | frps-private-beta  |


 ## Withdraw the case
    And the user selects "Withdraw application" for the case with a comment
    And the user click the "Confirm" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD             |
      | stage     | REVIEW_APPLICATION    |
      | status    | APPLICATION_WITHDRAWN |
      | clientRef | self                  |
      | grantCode | frps-private-beta     |

  Scenario: Application cases status - New application - Approved-agreement drafted - reject - Withdrawn
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD            |
      | stage     | REVIEW_APPLICATION   |
      | status    | APPLICATION_RECEIVED |
      | clientRef | self                 |
      | grantCode | frps-private-beta    |
    And the user opens the application from the "All cases" list

    ### Approve application
    And the user click the "Start" button
    And the user select "Accept" to complete "Check customer details" task
    And the user select "Accept" to complete "Review land parcel rule checks" task
    And the user select "Accept" to complete "Check if any land parcels are within an SSSI" task
    And the user select "Accept" to complete "Check payment amount" task
    And the user select "Accept" to complete "Review scheme budget as a finance officer" task
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD         |
      | stage     | REVIEW_OFFER      |
      | status    | AGREEMENT_DRAFTED |
      | clientRef | self              |
      | grantCode | frps-private-beta |
    And the user refresh the browser

    ## Reject the case
    And the user selects "Reject Application" for the case with a comment
    And the user click the "Confirm" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD            |
      | stage     | REVIEW_OFFER         |
      | status    | APPLICATION_REJECTED |
      | clientRef | self                 |
      | grantCode | frps-private-beta    |

    ## reinstate the application
    When the user click "Reinstate Application" with a comment
    And the user click the "Reinstate Application" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD         |
      | stage     | REVIEW_OFFER      |
      | status    | AGREEMENT_DRAFTED |
      | clientRef | self              |
      | grantCode | frps-private-beta |

 ## Withdraw the case
    And the user selects "Withdraw application" for the case with a comment
    And the user click the "Confirm" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD             |
      | stage     | REVIEW_OFFER          |
      | status    | APPLICATION_WITHDRAWN |
      | clientRef | self                  |
      | grantCode | frps-private-beta     |

  Scenario: Application cases status - New application - Approved-agreement offered -Withdrawn
    Given the user has submitted an application for the "frps-private-beta" grant
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD            |
      | stage     | REVIEW_APPLICATION   |
      | status    | APPLICATION_RECEIVED |
      | clientRef | self                 |
      | grantCode | frps-private-beta    |
    And the user opens the application from the "All cases" list

    ### Approve application
    And the user click the "Start" button
    And the user select "Accept" to complete "Check customer details" task
    And the user select "Accept" to complete "Review land parcel rule checks" task
    And the user select "Accept" to complete "Check if any land parcels are within an SSSI" task
    And the user select "Accept" to complete "Check payment amount" task
    And the user select "Accept" to complete "Review scheme budget as a finance officer" task
    And the user selects "Approve application" for the case with a comment
    And the user click the "Confirm" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD         |
      | stage     | REVIEW_OFFER      |
      | status    | AGREEMENT_DRAFTED |
      | clientRef | self              |
      | grantCode | frps-private-beta |
    Then the user should see "Agreements" tab
    When the user select "Confirm" to complete "Check draft funding agreement" task
    And the user select "Confirm" to complete "Notify customer that agreement is ready" task

    And the user selects "Agreement sent" for the case
    When the user click the "Confirm" button
    Then the user should see "Customer Agreement Review" message

    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD                 |
      | stage     | CUSTOMER_AGREEMENT_REVIEW |
      | status    | AGREEMENT_OFFERED         |
      | clientRef | self                      |
      | grantCode | frps-private-beta         |

 ## Withdraw the case
    And the user click "Withdraw application" with a comment
    And the user click the "Withdraw" button
    And the user refresh the browser
    Then the case details on GAS API for "frps-private-beta" should be:
      | phase     | PRE_AWARD                 |
      | stage     | CUSTOMER_AGREEMENT_REVIEW |
      | status    | APPLICATION_WITHDRAWN     |
      | clientRef | self                      |
      | grantCode | frps-private-beta         |


