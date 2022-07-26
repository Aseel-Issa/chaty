import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import User from '../classes/User'
import { useNavigate } from 'react-router-dom'

const theme = createTheme();
const Base_Url = '' //'http://localhost:8000'

export default function Signup(props){

    let navigate = useNavigate()
    const navigateToHomePage = () => {
        navigate('/')
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // console.log({
        //   email: data.get('email'),
        //   password: data.get('password'),
        // });
        let email= data.get('email')
        let password= data.get('password')
        let confirmedPassword= data.get('confirmedPassword')
        let firstName = data.get('firstName')
        let lastName = data.get('lastName')

        // the two passwords should be identical
        if(!(password===confirmedPassword)){
            alert('The two passwords are not identical')
            return
        }
        // all fields are required
        if(firstName === '' || lastName==='' || email==='' || password===''){
            alert('All fields are required')
            return
        }
        // create new user to server
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }

        try{
          // create new user request
            let result = await axios.post(Base_Url+'/api/user/new', user)
            // console.log(result)
            let loggedInUser = new User(result.data._id, result.data.firstName, result.data.lastName, result.data.email) 
            // impedent login - client side
            props.login(loggedInUser)

            navigateToHomePage()
        }catch(e){
            alert(e.toString() )
        }
        
      };

      return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: '#2b2d3a' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmedPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmed-password"
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: '#ea4b4b', '&:hover': {bgcolor: '#9ba3ad'}}}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      );

}