import {
    AppBar,
    Button,
    Container,
    Toolbar,
    Typography,
  } from "@mui/material";
  
import { SignedIn, SignedOut, UserButton, ClerkProvider } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#2c3e50" }}>
      <Container>
        <ClerkProvider>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              Flashcard SaaS
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Login</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>

        </ClerkProvider>
        
      </Container>
    </AppBar>
  );
}
