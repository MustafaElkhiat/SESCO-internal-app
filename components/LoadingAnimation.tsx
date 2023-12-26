import React from "react";
import { css } from "@emotion/react";
import { HashLoader } from "react-spinners";
import { motion } from "framer-motion";

const override = css`
  display: block;
  margin: 0 auto;
`;

const LoadingAnimation = () => {
  return (
    <motion.div
      className="flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HashLoader color="#7dd3fa"  size={50} />
    </motion.div>
  );
};

export default LoadingAnimation;
