import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal"; // Ensure you have react-modal installed: npm install react-modal

const InactivityTimer = ({
  timeoutDuration = 600000, // 10 minutes
  warningDuration = 30000, // 30 seconds
  excludedPaths = [
    "/login",
    "/register",
    "/",
    "/sign-up",
    "/about-us",
    "/how-we-work",
    "/events",
    "/contact",
    "/broker-user-guide",
    "/appraiser-user-guide",
    "/brokerage-company-user-guide",
    "/appraiser-company-user-guide",
    "/appraiser",
    "/mortgage-broker",
    "/appraiser-company",
    "/mortgage-brokerage",
    "/terms",
    "/faq",
  ], // Exclude these paths
}) => {
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );
  const [showWarning, setShowWarning] = useState(false);
  const [logoutCountdown, setLogoutCountdown] = useState(null);
  const router = useRouter();

  // Skip timer logic on excluded paths
  const isExcludedPath = excludedPaths.includes(router.pathname);

  useEffect(() => {
    if (isExcludedPath) return; // Skip timer on excluded pages

    const activityHandler = () => {
      setLastActivityTimestamp(Date.now());
      setShowWarning(false); // Reset warning if user becomes active
    };

    // Attach event listeners for user activity
    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("click", activityHandler);

    // Cleanup event listeners when the component is unmounted
    return () => {
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("keydown", activityHandler);
      window.removeEventListener("click", activityHandler);
    };
  }, [isExcludedPath]);

  useEffect(() => {
    if (isExcludedPath) return; // Skip the inactivity check on excluded pages

    const checkInactivity = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivityTimestamp;

      if (timeSinceLastActivity > timeoutDuration) {
        // Log out the user
        localStorage.removeItem("user");
        router.push("/login");
      } else if (
        timeSinceLastActivity > timeoutDuration - warningDuration &&
        !showWarning
      ) {
        // Show warning if close to timeout
        setShowWarning(true);
        startLogoutCountdown(Math.ceil(warningDuration / 1000)); // Start countdown
      }
    }, 1000); // Check every second for more responsiveness

    return () => clearInterval(checkInactivity);
  }, [
    lastActivityTimestamp,
    timeoutDuration,
    warningDuration,
    showWarning,
    isExcludedPath,
    router,
  ]);

  const startLogoutCountdown = (seconds) => {
    let remaining = seconds;
    setLogoutCountdown(remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      setLogoutCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setShowWarning(false); // Close modal when countdown reaches 0
      }
    }, 1000);
  };

  const stayLoggedIn = () => {
    setLastActivityTimestamp(Date.now());
    setShowWarning(false);
    setLogoutCountdown(null);
  };

  // Handle page navigation events to reset inactivity timer
  useEffect(() => {
    const handleRouteChange = () => {
      setLastActivityTimestamp(Date.now()); // Reset timer on page change
    };

    // Listen to route changes
    router.events.on("routeChangeStart", handleRouteChange);

    // Cleanup on unmount
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <>
      {showWarning && !isExcludedPath && (
        <Modal
          isOpen={showWarning}
          contentLabel="Inactivity Warning"
          style={{
            content: {
              top: "40%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            },
          }}
        >
          <h2 className="text-color">Session Expiring Soon</h2>
          <p className="fs-5">
            Your session will expire in {logoutCountdown} seconds due to
            inactivity.
          </p>
          {/* <button onClick={stayLoggedIn}>Stay Logged In</button> */}
        </Modal>
      )}
    </>
  );
};

export default InactivityTimer;
