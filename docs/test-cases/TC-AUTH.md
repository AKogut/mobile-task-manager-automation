# TC-AUTH — Authentication

Login, logout, session persistence, and form validation.

---

### TC-AUTH-001 — Successful login with valid credentials

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| Critical | Smoke | Cross-platform |

**Preconditions**

- App is launched and the Login screen is displayed
- User is not authenticated

**Test data**

| Field    | Value              |
| -------- | ------------------ |
| Email    | `demo@example.com` |
| Password | `Password123!`     |

**Steps**

1. Locate the email input (`login-email-input`)
2. Enter `demo@example.com`
3. Locate the password input (`login-password-input`)
4. Enter `Password123!`
5. Tap the submit button (`login-submit-button`)

**Expected result**

- A loading indicator appears briefly (`login-submit-loading`)
- User is navigated to the Home screen
- Home screen is visible (`main-screen`)
- No error banner is shown

---

### TC-AUTH-002 — Login fails with incorrect password

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- App is launched and the Login screen is displayed

**Test data**

| Field    | Value              |
| -------- | ------------------ |
| Email    | `demo@example.com` |
| Password | `WrongPassword!`   |

**Steps**

1. Enter `demo@example.com` in `login-email-input`
2. Enter `WrongPassword!` in `login-password-input`
3. Tap `login-submit-button`

**Expected result**

- Login request fails after ~400 ms
- Auth error banner is visible (`auth-error-banner`)
- Error message is displayed (`auth-error-message`)
- User remains on the Login screen (`login-screen`)
- No navigation to Home screen occurs

---

### TC-AUTH-003 — Login fails with unregistered email

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- App is launched and the Login screen is displayed

**Test data**

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `unknown@example.com` |
| Password | `Password123!`        |

**Steps**

1. Enter `unknown@example.com` in `login-email-input`
2. Enter `Password123!` in `login-password-input`
3. Tap `login-submit-button`

**Expected result**

- Auth error banner is visible (`auth-error-banner`)
- User remains on the Login screen

---

### TC-AUTH-004 — Login blocked with empty email field

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- App is launched and the Login screen is displayed

**Steps**

1. Leave `login-email-input` empty
2. Enter `Password123!` in `login-password-input`
3. Tap `login-submit-button`

**Expected result**

- Email validation error is displayed (`login-email-error`)
- No network request is made
- User remains on the Login screen

---

### TC-AUTH-005 — Login blocked with empty password field

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Functional | Cross-platform |

**Preconditions**

- App is launched and the Login screen is displayed

**Steps**

1. Enter `demo@example.com` in `login-email-input`
2. Leave `login-password-input` empty
3. Tap `login-submit-button`

**Expected result**

- Password validation error is displayed (`login-password-error`)
- No network request is made
- User remains on the Login screen

---

### TC-AUTH-006 — Login blocked with invalid email format

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- App is launched and the Login screen is displayed

**Test data**

| Field    | Value          |
| -------- | -------------- |
| Email    | `not-an-email` |
| Password | `Password123!` |

**Steps**

1. Enter `not-an-email` in `login-email-input`
2. Enter `Password123!` in `login-password-input`
3. Tap `login-submit-button`

**Expected result**

- Email validation error is displayed (`login-email-error`)
- No network request is made
- User remains on the Login screen

---

### TC-AUTH-007 — Error banner disappears when user edits an input

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- Login has been attempted with wrong credentials
- Auth error banner is visible (`auth-error-banner`)

**Steps**

1. Tap `login-email-input`
2. Clear the field and type any character

**Expected result**

- Auth error banner (`auth-error-banner`) is no longer visible

---

### TC-AUTH-008 — Demo credentials card is visible on Login screen

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- App is launched and the Login screen is displayed

**Steps**

1. Observe the Login screen without interacting

**Expected result**

- Demo credentials card is visible (`demo-credentials-card`)
- Card displays `demo@example.com` (`demo-credentials-email`)
- Card displays `Password123!` (`demo-credentials-password`)

---

### TC-AUTH-009 — Successful logout clears session

| Priority | Type  | Platform       |
| -------- | ----- | -------------- |
| Critical | Smoke | Cross-platform |

**Preconditions**

- User is authenticated and on the Home screen

**Steps**

1. Tap the settings button (`settings-open-button`)
2. Verify Settings screen is visible (`settings-screen`)
3. Tap the logout button (`logout-button`)

**Expected result**

- User is navigated to the Login screen
- Login screen is displayed (`login-screen`)
- Home screen is no longer accessible

---

### TC-AUTH-010 — Settings screen displays correct account info

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Medium   | Functional | Cross-platform |

**Preconditions**

- User is authenticated and on the Home screen

**Steps**

1. Tap `settings-open-button`
2. Observe the account section

**Expected result**

- Settings screen is visible (`settings-screen`)
- Account name is displayed (`settings-account-name`)
- Account email displays `demo@example.com` (`settings-account-email`)

---

### TC-AUTH-011 — Session persists after app restart

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Regression | Cross-platform |

**Preconditions**

- User has previously logged in successfully
- App is closed (background → terminated)

**Steps**

1. Relaunch the app

**Expected result**

- App navigates directly to the Home screen
- Login screen is not shown
- `main-screen` is visible without requiring credentials

---

### TC-AUTH-012 — Unauthenticated user lands on Login screen

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| High     | Regression | Cross-platform |

**Preconditions**

- No session stored (fresh install or after logout)

**Steps**

1. Launch the app

**Expected result**

- Login screen is displayed (`login-screen`)
- Home screen is not shown

---

### TC-AUTH-013 — Loading indicator shown during login request

| Priority | Type       | Platform       |
| -------- | ---------- | -------------- |
| Low      | Functional | Cross-platform |

**Preconditions**

- App is launched and the Login screen is displayed

**Test data**

| Field    | Value              |
| -------- | ------------------ |
| Email    | `demo@example.com` |
| Password | `Password123!`     |

**Steps**

1. Enter valid credentials
2. Tap `login-submit-button`
3. Immediately observe the submit button area

**Expected result**

- Loading indicator is briefly visible (`login-submit-loading`)
- Submit button is disabled while loading
