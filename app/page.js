'use client';
import getStripe from '@/utils/getStripe';
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import schedules from "./generate/page.js";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import axios from "axios";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout-session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  };

  return (
    <>
      <Head>
        <title>AI Study Scheduler</title>
        <meta name="description" content="Create a personalized study schedule to ace your exams!" />
      </Head>

      {/* Navbar */}
      <Navbar />

      {/* Get Started and Introduction */}
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
            Welcome to AI Study Scheduler
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "text.secondary", mb: 4 }}
          >
            The effective way to make time for studying.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large" component={Link} href="/generate"
            sx={{ px: 4, py: 1.5, fontSize: "1.25rem" }}
          >
            Get Started
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large" component={Link} href="/schedules"
            sx={{px: 4, py: 1.5, fontSize: "1.25rem" }}
          >
            View your Schedules
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ my: 8, textAlign: "center" }}>
          <Typography
            variant="h4"
            my={2}
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ px: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  AI Scheduler
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Simply input your subject, and time and we will do the rest!
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ px: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Smart Scheduler
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                Our AI intelligently breaks down your schedule into concise
                timings, perfect for studying.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ px: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Generate unlimited schedules
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                Access your schedules anytime, anywhere. 
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Pricing Section */}
        <Box sx={{ my: 8, textAlign: "center" }}>
          <Typography variant="h4" my={2} sx={{ fontWeight: "bold" }}>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6} lg={3}>
              <Box
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Free
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  ₹0 / month
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 3 }}>
                    Basic schedules with limited access
                </Typography>
                <Button variant="contained" color="primary" fullWidth component={Link} href="/generate"> 
                  Choose Free
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Box
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  ₹199 / month
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 3 }}>
                  Create and store up to 100 schedules
                </Typography>
                <Button variant="contained" color="primary" fullWidth onClick= {handleSubmit}>
                  Choose Basic
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Box
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Pro
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  ₹299 / month
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 3 }}>
                    Unlimited schedules and music along with priority AI support
                </Typography>
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
