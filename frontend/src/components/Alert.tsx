"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

interface AlertProps {
  message: string;
  status: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

export default function Alert({ message, status, duration = 5000, onClose }: AlertProps){
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  useEffect(() => {
    if (!isVisible && onClose) {
      const timer = setTimeout(onClose, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const handleClose = () => setIsVisible(false);

  const statusConfig = {
    success: {
      icon: <FaCheckCircle className="text-xl" />,
      bgColor: "bg-success",
      textColor: "text-white",
      iconColor: "text-white",
    },
    error: {
      icon: <FaExclamationCircle className="text-xl" />,
      bgColor: "bg-error",
      textColor: "text-white",
      iconColor: "text-white",
    },
    warning: {
      icon: <FaExclamationTriangle className="text-xl" />,
      bgColor: "bg-warning",
      textColor: "text-white",
      iconColor: "text-white",
    },
    info: {
      icon: <FaInfoCircle className="text-xl" />,
      bgColor: "bg-info",
      textColor: "text-white",
      iconColor: "text-white",
    },
  };

  const config = statusConfig[status];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className={`fixed top-22 right-2 z-50 flex items-center p-4 rounded-lg border-l-4 shadow-lg ${config.bgColor} ${config.textColor} max-w-sm`}
          role="alert"
        >
          <div className={`mr-3 ${config.iconColor}`}>{config.icon}</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 p-1 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Close alert"
          >
            <FaTimes />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const useAlert = () => {
  const [alert, setAlert] = useState<{
    message: string;
    status: "success" | "error" | "warning" | "info";
    duration?: number;
  } | null>(null);

  const showAlert = useCallback(
    (
      message: string,
      status: "success" | "error" | "warning" | "info" = "info",
      duration?: number
    ) => {
      setAlert({ message, status, duration });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const AlertComponent = useCallback(() => {
    if (!alert) return null;
    return (
      <Alert
        message={alert.message}
        status={alert.status}
        duration={alert.duration}
        onClose={hideAlert}
      />
    );
  }, [alert, hideAlert]);

  return { showAlert, hideAlert, AlertComponent };
};