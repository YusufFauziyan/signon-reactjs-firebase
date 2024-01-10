import { useState, forwardRef } from 'react';
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const theme = useTheme();
  const auth = getAuth();

  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccessSendEmail, setIsSuccessSendEmail] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email } = e.target;
    setEmailError(false);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!isValidEmail) {
      setEmailError(true);
      return;
    }

    try {
      await fetchSignInMethodsForEmail(auth, email.value);
      await sendPasswordResetEmail(auth, email.value);
      setLoading(false);
      setIsSuccessSendEmail(true);

      email.value = '';
    } catch (error) {
      setLoading(false);
      const errorCode = error.code;
      if (errorCode === 'auth/user-not-found') {
        console.error('Email does not exist');
      } else {
        console.error('Error sending reset email:', error.message);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSuccessSendEmail(false);
  };

  const renderForm = (
    <form onSubmit={handleResetPassword}>
      <Stack spacing={1}>
        <TextField
          required
          name="email"
          label="Your Email address"
          fullWidth
          helperText={emailError ? 'Please enter a valid email address' : ''}
        />

        <LoadingButton
          endIcon={<Iconify icon="mdi:email-fast-outline" />}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="info"
          loading={loading}
        >
          Send Link Reset
        </LoadingButton>
      </Stack>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h6" marginBottom={2}>
            Forgot Password
          </Typography>
          {renderForm}
          <Stack direction="row" alignItems="center" justifyContent="flex-end" marginTop={2}>
            <Link variant="subtitle2" underline="hover" href="/signin">
              Sign In
            </Link>
          </Stack>
        </Card>
      </Stack>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        open={isSuccessSendEmail}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Email sent successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
