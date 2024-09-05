'use client'
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { collection, doc, getDoc, writeBatch, setDoc, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation"; // Ensure you use this import
import { useEffect, useState } from "react";
import { db } from "@/firebase";


const Generate = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [schedules, setschedules] = useState([]);
  const [subject, setSubject] = useState("");
  const [number, setNumber] = useState(0);
  const[topics, setTopics] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  
  const router = useRouter(); // Ensure router is initialized
  

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log("User is not signed in");
    } else if (isLoaded && isSignedIn) {
      console.log("User is signed in with UID:", user.id);
      const userDocRef = doc(db, "users", user.id);
      const docSnap = getDoc(userDocRef);
      
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return null
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/generate", {subject, number, topics});
      const data = response.data;
      console.log(data);
      setschedules(data);
    } catch (error) {
      console.error("Error generating schedules:", error);
    }
  };

  const handleLogin = async () => {
    const userDocRef = doc(db, "users", user.id);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists())
    {
      setDoc(userDocRef, { access: true }, { merge: true });
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveschedules = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }
  
    try {
      console.log("Attempting to save schedules for user:", user.id);
      const batch = writeBatch(db);
      const userDocRef = doc(db, "users", user.id);
      const docSnap = await getDoc(userDocRef);
  
      console.log("Fetched user document:", docSnap.exists());
  
      let collections = [];
  
      if (docSnap.exists()) {
        collections = docSnap.data().schedules || [];
        if (collections.find((f) => f.name === name)) {
          alert("schedule collection with the same name already exists");
          return;
        }
      }
  
      collections.push({ name });
  
      batch.set(userDocRef, { schedules: collections, access: false }, { merge: true });
  
      const colRef = collection(userDocRef, name);
      schedules.forEach((schedule) => {
        const cardDocRef = doc(colRef);
        batch.set(cardDocRef, schedule);
      });
  
      console.log("Here I am 1");
      await batch.commit();
      console.log("schedules saved successfully");
      handleClose();
      router.push("/schedules");
    } catch (error) {
      console.error("Error saving schedules:", error);
    }
  };

  const numbers = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
    {
      value: 6,
      label: "6",
    },
    {
      value: 7,
      label: "7",
    },
    {
      value: 8,
      label: "8",
    },
    {
      value: 9,
      label: "9",
    },
    {
      value: 10,
      label: "10",
    },
    {
      value: 11,
      label: "11",
    },
    {
      value: 12,
      label: "12",
    },
    {
      value: 13,
      label: "13",
    },
    {
      value: 14,
      label: "14",
    },
    {
      value: 15,
      label: "15",
    },
    {
      value: 16,
      label: "16",
    }
  ];
  

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant={"h4"}>Generate Schedule</Typography>
        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant={"h5"}>Subject Name</Typography>

          <TextField
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            label="E.g Math, Science, History"
            fullWidth
            multiline
            variant="filled"
            sx={{ mb: 2 }}
          />
          <Typography variant={"h5"}>Number of Hours</Typography>
          <TextField
            id="outlined-numbers"
            select
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            label="E.g: 1,2,3"
            defaultValue="1"
            helperText="Please select your hours"
          >
            {numbers.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant={"h5"}>Topics to cover</Typography>
          <Typography variant={"h6"}>Put it in commas</Typography>
          <TextField
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            label="E.g Differentials, DNA, Roman Empire"
            fullWidth
            multiline
            variant="filled"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              handleLogin();
              const userDocRef = doc(db, "users", user.id);
              const docSnap = await getDoc(userDocRef);

              if (docSnap.exists() && docSnap.data().access === false) {
                alert(
                  "You used up your free trial. Please pay to continue using the service."
                );
              } else {
                setDoc(userDocRef, { access: false }, { merge: true });
                handleSubmit();
              }
            }}
            fullWidth
          >
            Submit
          </Button>
        </Paper>
      </Box>

      {schedules.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Schedule Preview
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {schedules.map((schedule, index) => (
              <Card
                key={index}
                sx={{
                  perspective: "1000px",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                  },
                  mb: 2,
                }}
              >
                <CardActionArea>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      boxSizing: "border-box",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#333",
                        marginRight: "10px", // Add this line
                      }}
                    >
                      Hour {schedule.hour}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {schedule.description}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            ))}
          </Box>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Schedule</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter schedule collection name...
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveschedules}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Generate;
