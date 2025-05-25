"use client";

import Lottie from "lottie-react";
import { motion } from "framer-motion";

// Import your Lottie JSON files here
import secureLoginAnimation from "../../../public/animations/secure-login.json";
import welcomeBackAnimation from "../../../public/animations/welcome-back.json";
import createAccountAnimation from "../../../public/animations/create-account.json";

const animations = {
  secureLogin: secureLoginAnimation,
  welcomeBack: welcomeBackAnimation,
  createAccount: createAccountAnimation,
};

interface AuthAnimationProps {
  type: keyof typeof animations;
  className?: string;
}

export function AuthAnimation({ type, className }: AuthAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full max-w-[300px] mx-auto ${className}`}
    >
      <Lottie
        animationData={animations[type]}
        loop={true}
        className="w-full h-full"
      />
    </motion.div>
  );
}
