import { Button, TextInput } from "flowbite-react";
import { useRef } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "~config/AuthContext";
import { defaultTextTheme, mainButtonTheme } from "~config/themes";

function ForgotPassword() {
  //initialize the variables
  const email = useRef(null);
  const navigate = useNavigate();

  //fetch custom functions from custom context
  const { verifyEmail, setAlert } = useAuth();

  //function for processing the email address entered by the user
  const validateEmailAddress = async (e) => {
    e.preventDefault();

    //retrieve the email address from the reference variable
    const emailAddress = email.current.value;

    //regex used for testing if email address has both @ and .
    if (/@|./.test(emailAddress)) {
      const response = await verifyEmail(emailAddress);

      //if response has success and its true, show the success alert or else show the failed alert message.
      if (response?.success) {
        setAlert({
          isOn: true,
          type: "success",
          message: "Your email has been verified!",
        });
        navigate(`./email-verified`, {
          state: {
            email_address: emailAddress,
          },
        });
      } else {
        setAlert({
          isOn: true,
          type: "failure",
          message:
            "The email address you've entered is not registered to the system.",
        });
      }
    }
  };
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-sm w-full bg-white shadow flex flex-col items-center p-4 gap-4">
              <header className="w-full pb-2 border-b">
                <p className="text-2xl font-semibold">Password Recovery</p>
              </header>
              <main className="w-full flex flex-col gap-4">
                <form
                  method="POST"
                  className="flex flex-col gap-4"
                  onSubmit={validateEmailAddress}
                >
                  <div className="flex flex-col gap-4">
                    <p className="text-center">
                      To change your password, please enter your registered
                      email address. There we will send you the instructions and
                      the link for the password recovery.
                    </p>
                    <TextInput
                      id="email_address"
                      type="email"
                      required
                      size="md"
                      defaultValue=""
                      placeholder="Email address"
                      ref={email}
                      theme={defaultTextTheme}
                    />
                  </div>
                  <Button
                    type="submit"
                    color="transparent"
                    className="bg-secondary text-white"
                    theme={mainButtonTheme}
                  >
                    Submit
                  </Button>
                </form>
              </main>
            </div>
          }
        />
        <Route path="/email-verified" element={<VerifiedLink />} />
      </Routes>
    </div>
  );
}

function VerifiedLink() {
  //retrieve the email_address from the body of the url
  const location = useLocation();
  const email = location.state?.email_address;

  //show the success message
  return (
    <div className="max-w-xl w-full bg-white shadow flex flex-col items-center p-8 gap-4">
      <header className="w-full pb-2 border-b">
        <p className="text-2xl font-semibold">Email Verified</p>
      </header>
      <main className="w-full flex flex-col gap-4 text-xl">
        <p>
          To recover your password, please follow the instructions sent to your
          email, <span className="font-semibold">{email}</span>. If you cannot
          find our email in your inbox, please check your spam folder.
        </p>
      </main>
    </div>
  );
}

export default ForgotPassword;
