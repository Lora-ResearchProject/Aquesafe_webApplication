// import { render, screen, fireEvent } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import Login from "../Pages/Login";

// test("Renders login form and handles user input", () => {
//   render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>
//   );

//   // Check for the heading "Login"
//   const loginHeading = screen.getByRole("heading", { level: 2, name: /login/i });
//   expect(loginHeading).toBeInTheDocument();

//   // Check for email and password input fields
//   const emailInput = screen.getByLabelText(/email/i);
//   expect(emailInput).toBeInTheDocument();

//   const passwordInput = screen.getByLabelText(/password/i);
//   expect(passwordInput).toBeInTheDocument();

//   // Simulate user typing in email and password
//   fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//   fireEvent.change(passwordInput, { target: { value: "password123" } });

//   expect(emailInput.value).toBe("test@example.com");
//   expect(passwordInput.value).toBe("password123");

//   // Check if the login button is present
//   const loginButton = screen.getByRole("button", { name: /login/i });
//   expect(loginButton).toBeInTheDocument();
// });