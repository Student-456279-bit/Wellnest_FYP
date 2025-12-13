// shared/api.js
const API_URL_AUTH = "http://localhost:5000/api/auth";
const API_URL_FORGOT = "http://localhost:5000/api/forgor";

// -------------------- SIGNUP --------------------
export async function signupUser(data) {
  try {
    const res = await fetch(`${API_URL_AUTH}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json(); // parse JSON even for errors
    if (!res.ok) {
      return { error: json.message || json.error || `HTTP ${res.status}` };
    }

    return json;
  } catch (err) {
    console.error("Signup API call failed:", err);
    return { error: err.message };
  }
}

// -------------------- SIGNIN --------------------
export async function signinUser(data) {
  try {
    const res = await fetch(`${API_URL_AUTH}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json.message || json.error || `HTTP ${res.status}` };
    }

    return json;
  } catch (err) {
    console.error("Signin API call failed:", err);
    return { error: err.message };
  }
}

// -------------------- PASSWORD RESET --------------------

// Request reset code
export async function requestResetCode(email) {
  try {
    const res = await fetch(`${API_URL_FORGOT}/request_reset_code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json.message || json.error || `HTTP ${res.status}` };
    }

    return json;
  } catch (err) {
    console.error("Request Reset Code API call failed:", err);
    return { error: err.message };
  }
}

// Verify reset code
export async function verifyResetCode(email, code) {
  try {
    const res = await fetch(`${API_URL_FORGOT}/verify_reset_code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json.message || json.error || `HTTP ${res.status}` };
    }

    return json;
  } catch (err) {
    console.error("Verify Reset Code API call failed:", err);
    return { error: err.message };
  }
}

// Reset password
export async function resetPassword(email, new_password) {
  try {
    const res = await fetch(`${API_URL_FORGOT}/reset_password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, new_password }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json.message || json.error || `HTTP ${res.status}` };
    }

    return json;
  } catch (err) {
    console.error("Reset Password API call failed:", err);
    return { error: err.message };
  }
}

// -------------------- WELLNESS PLAN --------------------
const API_URL_WELLNESS = "http://localhost:5000/api/wellness";

export async function generateWellnessPlan(email) {
  try {
    const res = await fetch(`${API_URL_WELLNESS}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();
    // 409 is acceptable (Plan exists), so treat 200 and 409 as success for fetching data
    if (!res.ok && res.status !== 409) {
      return { error: json.message || json.error || `HTTP ${res.status}` };
    }

    return json;
  } catch (err) {
    console.error("Wellness Plan API call failed:", err);
    return { error: err.message };
  }
}
