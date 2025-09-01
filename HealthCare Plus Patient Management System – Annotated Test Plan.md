---

# **HealthCare Plus Patient Management System – Annotated Test Plan**

---

## **1. Annotations on Original Test Plan**

| Test Case ID | Annotation / Missing Detail                                                                     | Recommendation                                                          |
| ------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| TC-001       | Missing precondition for “patient must be logged in”                                            | Add “Patient must be logged in with valid credentials”                  |
| TC-002       | Expected result does not specify whether system locks after multiple failed attempts            | Update expected result to include lockout logic after 3 failed attempts |
| TC-003       | Only checks unavailable time slot, but does not check overlapping appointments for same patient | Add validation for patient overlapping bookings                         |
| TC-004       | Blank field check does not include both PatientID and credentials combination                   | Specify in precondition: both fields blank and partial blanks           |
| TC-005       | Unauthorized access does not mention logging for audit purposes (HIPAA)                         | Add expected result: “System logs unauthorized access attempt”          |

---

## **2. Added Test Case (Edge Scenario)**

**Test Case ID:** TC-006
**Requirement ID:** REQ-APPT-01
**Test Title:** Duplicate appointment attempt
**Objective:** Verify system prevents the same patient from booking multiple appointments at the same time.
**Preconditions:** Patient is authenticated; patient already has a confirmed appointment for the selected time.
**Test Steps:**

1. Enter valid PatientID and credentials.
2. Select a time slot already booked by the patient.
3. Click book.
   **Expected Result:**

* Error: “You already have an appointment scheduled for this time.”
* Booking is not created.
  **Priority:** High
  **Owner:** QA Team

---

## **3. TDD Test Objective**

**Objective:**
Restrict appointment bookings after three failed attempts by temporarily blocking PatientID to prevent unauthorized access.

**Developer-Facing Note:**

* **Input:** PatientID and credentials
* **Expected Outcome:** First two failed attempts show error; third failed attempt triggers temporary lockout.
* **Rule:** Lockout period enforced before allowing new booking attempts.

---

## **4. BDD Scenarios (Gherkin Syntax)**

**Scenario 1: Successful appointment booking with valid credentials**

```gherkin
Given I am a registered patient
And I enter my valid PatientID and credentials
When I select an available appointment time
Then I should receive a booking confirmation
```

**Scenario 2: Booking attempt with unauthorized PatientID**

```gherkin
Given I am not a registered patient
And I enter an invalid PatientID
When I attempt to book an appointment
Then I should see an error message: "Unauthorized access. Please register."
```

**Scenario 3: Booking restriction after three failed attempts**

```gherkin
Given I am a registered patient
And I enter incorrect credentials three times
When I attempt to book another appointment
Then my PatientID should be temporarily restricted
And I should see an error message: "Too many failed attempts. Try again later."
```

---

## **5. Edge Case Considerations**

| Edge Case                                                           | Risk / Gap                                      | Recommendation                                    |
| ------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| Patient enters valid PatientID but selects an unavailable time slot | Booking fails silently or double booking occurs | Display clear error and prevent duplicate booking |
| Booking page refreshed after two failed attempts                    | Session may lose lockout logic                  | Ensure lockout state persists server-side         |
| Rapid repeated submissions by automated bots                        | System may be vulnerable to brute-force booking | Implement rate limiting and CAPTCHA verification  |

---

## **6. Analyst Summary**

In this review, I improved the HealthCare Plus test plan by:

* Adding annotations to highlight missing preconditions and gaps.
* Creating a new edge-case test (duplicate appointment attempt).
* Writing a TDD objective to validate booking logic with lockout enforcement.
* Developing BDD scenarios to clearly represent positive and negative booking flows.
* Identifying edge cases to prevent errors, misuse, or system vulnerabilities.

These enhancements ensure reliable, HIPAA-compliant appointment booking, strengthen QA coverage, and improve collaboration between developers and testers.


