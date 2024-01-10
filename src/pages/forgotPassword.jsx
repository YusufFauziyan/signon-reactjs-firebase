import { Helmet } from 'react-helmet-async';

import { ForgotPasswordView } from 'src/sections/forgotPassword';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <>
      <Helmet>
        <title> Sign Up</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}
