@writer
Feature: Woodland Grant Application status

  @cw
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
    And the user opens the application from the All cases list

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

  @cw
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
    And the user opens the application from the All cases list

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

  @test-env-only
  Scenario: Application submitted via grant Ui and complete claim
    Given the user submit the application using grants ui
    And the user signed into Caseworking as a writer
    When the user open the application submitted using grants ui
    Then the case status should be "Application received"
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD             |
      | stage     | STAGE_REVIEWING_APPLICATION |
      | status    | STATUS_APPLICATION_RECEIVED |
      | clientRef | self                        |
      | grantCode | woodland                    |
    And the user opens the application from the All cases list

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

    Then the user should see below "woodland" tasks details
      | Notify customer that draft agreement is ready | Incomplete |

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

    When the user accept the agreement
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD           |
      | stage     | STAGE_AGREEMENT_ACCEPTED  |
      | status    | STATUS_AGREEMENT_ACCEPTED |
      | clientRef | self                      |
      | grantCode | woodland                  |

    When the user navigate to Caseworking as a writer
    And the user refresh the browser
    And the user opens the application from the All cases list

    Then the user should see "Agreement accepted" message
    #Complete CRM Task
    And the user select "Created" to complete "Create CRM record" task
    Then the user should see below "woodland" tasks details
      | Create CRM record | Created |

    When the user enter "Action Forward to FC" comment
    And the user click the "Forestry Commission has been notified" button
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD                |
      | stage     | STAGE_FC_REVIEWING             |
      | status    | STATUS_APPLICATION_AWAITING_FC |
      | clientRef | self                           |
      | grantCode | woodland                       |


    ##Approve the Record Forestry Commission decision
    Then the user should see "Record Forestry Commission decision" message
    When the user select the "Approved the plan" radio button
    And the user click the "Confirm" button

    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_CLAIM           |
      | stage     | STAGE_AWAITING_CLAIM  |
      | status    | STATUS_AWAITING_CLAIM |
      | clientRef | self                  |
      | grantCode | woodland              |

    #complete Forestry Commission review
    Then the user should see "Forestry Commission review" message
    And the user select "Created" to complete "Record total eligible area of woodland" task
    And the user select "Notification sent" to complete "Tell the customer they can make a claim" task
    Then the user should see below "woodland" tasks details
      | Record total eligible area of woodland  | Completed |
      | Tell the customer they can make a claim | Completed |

    And the user click the "Complete Forestry Commission review" button
    Then the user should see "Waiting for the customer to claim" message

    ###User navigate to GPA to approve the claim
    When the user navigate to GPA as a writer
    Then the user should see "Claimable items" message

    When the user create WMP entitlement claim for 105 ha

    ##user navigate to grant UI and accept the claim
    When the user navigate to grant ui
    Then the "Review your WMP claim" page should be displayed
    And the user should see claim amount
    And the user click the "Continue" button
    And the user click the "Confirm and submit" button
    Then the "Claim submitted" page should be displayed

    ###check the claim on CW
    When the user navigate to Caseworking as a writer
    And the user refresh the browser
    And the user opens the application from the All cases list
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_CLAIM           |
      | stage     | STAGE_CLAIM_COMPLETE  |
      | status    | STATUS_CLAIM_COMPLETE |
      | clientRef | self                  |
      | grantCode | woodland              |
    When the user click the "Claims" link
    When the user should see "Claims" tab
    Then the user should see submitted claim details

  @test-env-only
  Scenario: Application submitted via grant Ui and terminated at FC
    Given the user submit the application using grants ui
    And the user signed into Caseworking as a writer
    When the user open the application submitted using grants ui
    Then the case status should be "Application received"
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD             |
      | stage     | STAGE_REVIEWING_APPLICATION |
      | status    | STATUS_APPLICATION_RECEIVED |
      | clientRef | self                        |
      | grantCode | woodland                    |
    And the user opens the application from the All cases list

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

    Then the user should see below "woodland" tasks details
      | Notify customer that draft agreement is ready | Incomplete |

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

    When the user accept the agreement
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD           |
      | stage     | STAGE_AGREEMENT_ACCEPTED  |
      | status    | STATUS_AGREEMENT_ACCEPTED |
      | clientRef | self                      |
      | grantCode | woodland                  |

    When the user navigate to Caseworking as a writer
    And the user refresh the browser
    And the user opens the application from the All cases list

    Then the user should see "Agreement accepted" message
    #Complete CRM Task
    And the user select "Created" to complete "Create CRM record" task
    Then the user should see below "woodland" tasks details
      | Create CRM record | Created |

    When the user enter "Action Forward to FC" comment
    And the user click the "Forestry Commission has been notified" button
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD                |
      | stage     | STAGE_FC_REVIEWING             |
      | status    | STATUS_APPLICATION_AWAITING_FC |
      | clientRef | self                           |
      | grantCode | woodland                       |


    ##Approve the Record Forestry Commission decision
    Then the user should see "Record Forestry Commission decision" message
    When the user select the "Rejected the plan" radio button
    And the user enter "ACTION FC REJECT PLAN" comment
    And the user click the "Confirm" button

    When the user select the "Yes" radio button
    And the user click the "Confirm" button
    And the user refresh the browser
    Then the user should see "Record Forestry Commission decision" message

    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD           |
      | stage     | STAGE_FC_REVIEWING        |
      | status    | STATUS_AGREEMENT_REJECTED |
      | clientRef | self                      |
      | grantCode | woodland                  |

  @test-env-only1
  Scenario: Application submitted via grant Ui and Withdrawn at FC
    Given the user submit the application using grants ui
    And the user signed into Caseworking as a writer
    When the user open the application submitted using grants ui
    Then the case status should be "Application received"
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD             |
      | stage     | STAGE_REVIEWING_APPLICATION |
      | status    | STATUS_APPLICATION_RECEIVED |
      | clientRef | self                        |
      | grantCode | woodland                    |
    And the user opens the application from the All cases list

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

    Then the user should see below "woodland" tasks details
      | Notify customer that draft agreement is ready | Incomplete |

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

    When the user accept the agreement
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD           |
      | stage     | STAGE_AGREEMENT_ACCEPTED  |
      | status    | STATUS_AGREEMENT_ACCEPTED |
      | clientRef | self                      |
      | grantCode | woodland                  |

    When the user navigate to Caseworking as a writer
    And the user refresh the browser
    And the user opens the application from the All cases list

    Then the user should see "Agreement accepted" message
    #Complete CRM Task
    And the user select "Created" to complete "Create CRM record" task
    Then the user should see below "woodland" tasks details
      | Create CRM record | Created |

    When the user enter "Action Forward to FC" comment
    And the user click the "Forestry Commission has been notified" button
    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD                |
      | stage     | STAGE_FC_REVIEWING             |
      | status    | STATUS_APPLICATION_AWAITING_FC |
      | clientRef | self                           |
      | grantCode | woodland                       |


    ##Approve the Record Forestry Commission decision
    Then the user should see "Record Forestry Commission decision" message
    When the user select the "Withdrawal requested by customer" radio button
    And the user enter "ACTION FC WITHDRAWAL REQUESTED" comment
    And the user click the "Confirm" button

    When the user select the "Yes" radio button
    And the user click the "Confirm" button
    And the user refresh the browser
    Then the user should see "Record Forestry Commission decision" message

    Then the case details on GAS API for "woodland" should be:
      | phase     | PHASE_PRE_AWARD           |
      | stage     | STAGE_FC_REVIEWING        |
      | status    | STATUS_APPLICATION_WITHDRAWN |
      | clientRef | self                      |
      | grantCode | woodland                  |












