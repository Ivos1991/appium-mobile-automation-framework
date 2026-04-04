@smoke
Feature: Mobile banking smoke path
  As a banking customer
  I want one stable authenticated smoke path
  So that the local Appium setup proves the core flow is executable

  Scenario: successful login smoke path
    Given the user is on the mobile banking login screen
    When the user signs in with valid credentials for runtime smoke
    Then the successful login confirmation is visible
