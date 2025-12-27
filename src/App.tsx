import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Activities from "./components/Activities";
import Footer from "./components/Footer";
import Schedule from "./components/Schedule";
import About from "./components/About";
import Gallery from "./components/Gallery";
import ActivityDetail from "./components/ActivityDetail";
import AllActivities from "./components/AllActivites";
import Callbook from "./components/Callbook";
import AdminApp from "./admin/AdminApp";
import AdminLogin from "./admin/components/AdminLogin";
import { useAuth } from "./auth/AuthContext";

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const { role } = useAuth()
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Hero />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <About />
            </PageWrapper>
          }
        />
        <Route
          path="/schedule"
          element={
            <PageWrapper>
              <Schedule />
            </PageWrapper>
          }
        />
        <Route
          path="/activities"
          element={
            <PageWrapper>
              <Activities />
            </PageWrapper>
          }
        />
        <Route
          path="/gallery"
          element={
            <PageWrapper>
              <Gallery />
            </PageWrapper>
          }
        />
        <Route
          path="/callbook"
          element={
            <PageWrapper>
              <Callbook />
            </PageWrapper>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/activities/:id" element={
          <PageWrapper>
            <ActivityDetail />
          </PageWrapper>} />
        <Route path="/all-activities" element={<AllActivities />} />
        {role === "user" && <Route path="/admin/*" element={<AdminApp />} />}
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
