@cw @writer
Feature: Woodland Grant Application status

  Scenario: WMP application cases status - New Application -- agreement generated
    Given the user has submitted an application for the "woodland" grant
    And the user signed into Caseworking as a writer
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD             |
      | stage     | STAGE_REVIEWING_APPLICATION |
      | status    | STATUS_APPLICATION_RECEIVED |
      | clientRef | self                        |
      | grantCode | woodland                    |
    And the user opens the application from the "All cases" list

    ### start the case
    And the user click the "Start" button
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD             |
      | stage     | STAGE_REVIEWING_APPLICATION |
      | status    | STATUS_APPLICATION_RECEIVED |
      | clientRef | self                        |
      | grantCode | woodland                    |

    ## Approve the WMP case
    ##selecting Generate agreement radio button
    And the user selects "ACTION APPROVE APPLICATION" for the case
    And the user click the "Confirm" button

    ## Agreement generated
    And the user clicks the "Refresh page" link until the draft agreement is received
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD                      |
      | stage     | STAGE_PREPARING_AGREEMENT            |
      | status    | STATUS_AGREEMENT_READY_FOR_APPLICANT |
      | clientRef | self                                 |
      | grantCode | woodland                             |

    And the user select "Sent to customer" to complete "Notify customer that draft agreement is ready" task
    Then the user should see below "woodland" tasks details
      | Notify customer that draft agreement is ready | Sent |

    And the user enter "Action Confirm Agreement Sent" comment
    And the user click the "Confirm agreement sent" button

    Then the user should see "Agreement with applicant" message

    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD                |
      | stage     | STAGE_AGREEMENT_WITH_APPLICANT |
      | status    | STATUS_AGREEMENT_OFFERED       |
      | clientRef | self                           |
      | grantCode | woodland                       |

  Scenario: WMP application cases status - New Application -- Return to customer
    Given the user has submitted an application for the "woodland" grant
    And the user signed into Caseworking as a writer
    When the user waits for the case to appear on the Casework Portal
    Then the case status should be "Application received"
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD             |
      | stage     | STAGE_REVIEWING_APPLICATION |
      | status    | STATUS_APPLICATION_RECEIVED |
      | clientRef | self                        |
      | grantCode | woodland                    |
    And the user opens the application from the "All cases" list

    ### start the case
    And the user click the "Start" button
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD             |
      | stage     | STAGE_REVIEWING_APPLICATION |
      | status    | STATUS_APPLICATION_RECEIVED |
      | clientRef | self                        |
      | grantCode | woodland                    |

    ## Approve the WMP case
    ##selecting return to customer radio button
    And the user selects "ACTION RETURN TO CUSTOMER" for the case with a comment
    And the user click the "Confirm" button

#  Yes, return the application to customer
    And the user selects Option "yes" for the case
    And the user click the "Confirm" button

    Then the user should see "Returned to customer" message

    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD             |
      | stage     | STAGE_APPLICATION_AMENDMENT |
      | status    | STATUS_RETURNED_TO_CUSTOMER |
      | clientRef | self                        |
      | grantCode | woodland                    |

