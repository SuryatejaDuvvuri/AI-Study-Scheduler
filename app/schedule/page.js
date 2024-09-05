"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { useSearchParams } from "next/navigation";

export default function schedule() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [schedules, setschedules] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    const getschedule = async () => {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);

      const cards = [];

      docs.forEach((doc) => {
        cards.push({ id: doc.id, ...doc.data() });
      });
      setschedules(cards);
    };
    getschedule();
  }, [user, search]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  return (
    <Container maxWidth="100vw">
      <Grid container maxWidth={"100%"} spacing={3} sx={{ mt: 4 }}>
        {schedules.length > 0 && (
          <Box width={"100%"} sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} textAlign={"center"}>
              Schedule Preview
            </Typography>
            <Grid container spacing={3}>
              {schedules.map((schedule, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      perspective: "1000px",
                      "&:hover": {
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <CardActionArea>
                      <Box
                        sx={{
                          transformStyle: "preserve-3d",
                          transition: "transform 0.6s",
                          position: "relative",
                          height: "200px",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            boxSizing: "border-box",
                            backgroundColor: "#fff",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              color: "#333",
                            }}
                          >
                            {schedule.hour}
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
                        <Box
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            boxSizing: "border-box",
                            backgroundColor: "#fff",
                            borderRadius: 2,
                          }}
                        >
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
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Grid>
    </Container>
  );
}
