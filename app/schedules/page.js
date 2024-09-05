"use client";

import { useUser } from "@clerk/nextjs";
import {use, useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";

export default function schedules() {
  const { user, isLoaded, isSignedIn } = useUser();  
  const [schedules, setSchedules] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getSchedules = async () => {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().schedules || [];
        setSchedules(collections);
      } else {
        await setDoc(docRef, { schedules: [] });
      }
    };
    getSchedules();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`/schedule?id=${id}`);
  };

  return (
    <Container maxWidth="100vw">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {schedules.map((schedule, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(schedule.name)}> 
                <CardContent>
                  <Typography variant="h6">{schedule.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
