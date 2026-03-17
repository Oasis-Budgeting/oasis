## 2023-10-27 - Mitigating User Enumeration via Timing Attacks in Login
**Vulnerability:** The `/login` endpoint returned different responses based on user existence and took different amounts of time, allowing attackers to guess valid usernames/emails.
**Learning:** Early returns when checking for user existence in DB bypass the slower `bcrypt.compare` computation. Both error responses ("User not found" and "Invalid password") must be exactly the same string *and* take the same amount of computation time.
**Prevention:** Perform a dummy `bcrypt.compare` with a hardcoded valid hash when the user is not found to normalize response times, and use a unified error message ("Invalid credentials") for both cases.
