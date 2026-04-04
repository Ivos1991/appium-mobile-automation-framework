Feature: Guard an authenticated session
  As a banking customer
  I want the app to guard access after a session interruption
  So that I must sign in again before viewing account details

  Scenario: session interruption requires login again
    Given the user is on the mobile banking login screen
    When the user signs in with valid credentials
    And the authenticated account summary content is visible
    And the authenticated app session is restarted
    Then the user is required to sign in again
