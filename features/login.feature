Feature: Login to mobile banking
  As a banking customer
  I want to sign in to the mobile banking app
  So that I can access my account overview

  Scenario: successful login shows authenticated account summary content
    Given the user is on the mobile banking login screen
    When the user signs in with valid credentials
    Then the authenticated account summary content is visible

  Scenario: failed login with invalid credentials
    Given the user is on the mobile banking login screen
    When the user signs in with invalid credentials
    Then the login attempt is rejected
