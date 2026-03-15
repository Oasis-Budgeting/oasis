## 2025-03-15 - User Enumeration via Timing Attack
**Vulnerability:** The login endpoint checked if a user existed first and immediately returned 401 if they didn't, bypassing the `bcrypt.compare` function. This created a timing difference between existing and non-existing users, allowing attackers to enumerate valid usernames.
**Learning:** Returning a generic error message ("Invalid credentials") is not enough if the time taken to process the request gives away the user's existence.
**Prevention:** Always perform a dummy `bcrypt.compare` with a pre-computed valid hash when a user is not found, before returning an error.
