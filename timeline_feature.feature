Feature: Timeline Event Management
  As a user of the WeTheParent application
  I want to create, view, edit, and delete events on my case timeline
  So that I can maintain an accurate and up-to-date chronological record of my case.

  Background:
    Given I am a logged-in user
    And I have navigated to the "/timeline" page
    And the timeline initially displays a statistic for the "Total Number of Events"

  @Create
  Scenario: Successfully create a new timeline event
    Given the initial "Total Number of Events" is X
    When I click the "Add New Event" button
    And I enter "Filed Motion to Compel Discovery" in the "Event Title" field
    And I select "2025-10-15" as the "Event Date"
    And I enter "Filed the motion with the clerk of courts after the opposing party failed to respond." in the "Event Description" field
    And I click the "Save Event" button
    Then I should see a success notification confirming the event was created
    And the event with the title "Filed Motion to Compel Discovery" should appear in the timeline list
    And the "Total Number of Events" statistic should be updated to X + 1

  @Update
  Scenario: Edit an existing timeline event
    Given an event with the title "Initial Consultation" exists on the timeline
    And the initial "Total Number of Events" is Y
    When I find the event "Initial Consultation" in the timeline list
    And I click the "Edit" button for that event
    And I change the "Event Title" to "Strategy Meeting with Counsel"
    And I change the "Event Date" to "2025-11-01"
    And I click the "Save Changes" button
    Then I should see a success notification confirming the event was updated
    And the event title in the list should now be "Strategy Meeting with Counsel"
    And its date should be updated to "November 1, 2025"
    And the "Total Number of Events" statistic should remain Y

  @Delete
  Scenario: Delete a timeline event
    Given an event with the title "Mediation Session" exists on the timeline
    And the initial "Total Number of Events" is Z
    When I find the event "Mediation Session" in the timeline list
    And I click the "Delete" button for that event
    And I confirm the action in the deletion confirmation dialog
    Then I should see a success notification confirming the event was deleted
    And the event "Mediation Session" should no longer appear in the timeline list
    And the "Total Number of Events" statistic should be updated to Z - 1

  @Validation
  Scenario Outline: Attempt to create an event with missing information
    Given I am on the new event creation form
    When I enter "<title>" in the "Event Title" field
    And I select "<date>" as the "Event Date"
    And I click the "Save Event" button
    Then I should see a validation error message stating "<errorMessage>"
    And the event should not be created
    And the "Total Number of Events" statistic should not change

    Examples:
      | title                   | date         | errorMessage                  |
      |                         | 2025-12-10   | "Event Title is a required field" |
      | Phone call with witness |              | "Event Date is a required field"  |
      |                         |              | "Event Title and Date are required" |
