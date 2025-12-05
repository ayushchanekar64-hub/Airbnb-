'use client';

import { useEffect } from 'react';

export default function DatePickerStyling() {
  useEffect(() => {
    // Global date picker styling for all pages
    const style = document.createElement('style');
    style.textContent = `
      input[type="date"] {
        color: #000000 !important;
        background-color: #ffffff !important;
        border: 2px solid #000000 !important;
        padding: 8px !important;
        border-radius: 4px !important;
        font-size: 14px !important;
        font-weight: bold !important;
      }
      input[type="date"]::-webkit-calendar-picker-indicator {
        width: 20px !important;
        height: 20px !important;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>') no-repeat center !important;
        cursor: pointer !important;
        filter: none !important;
      }
      input[type="date"]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        display: none !important;
      }
      input[type="date"]::-webkit-clear-button {
        -webkit-appearance: none !important;
        display: none !important;
      }
      input[type="date"]::-webkit-datetime-edit-text {
        color: #000000 !important;
      }
      input[type="date"]::-webkit-datetime-edit-month-field {
        color: #000000 !important;
      }
      input[type="date"]::-webkit-datetime-edit-day-field {
        color: #000000 !important;
      }
      input[type="date"]::-webkit-datetime-edit-year-field {
        color: #000000 !important;
      }
      /* Global text color fix for all pages */
      body, html {
        color: white !important;
      }
      h1, h2, h3, h4, h5, h6 {
        color: white !important;
      }
      p, span, div, label {
        color: white !important;
      }
      input[type="text"], input[type="email"], input[type="password"], textarea {
        color: white !important;
        background-color: #374151 !important;
        border: 1px solid #4b5563 !important;
      }
      /* Cool animations for home page */
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
        100% { transform: translateY(0px) rotate(360deg); }
      }
      @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-blob {
        animation: blob 7s infinite;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-float-delay-1 {
        animation: float 6s ease-in-out infinite;
        animation-delay: 2s;
      }
      .animate-float-delay-2 {
        animation: float 6s ease-in-out infinite;
        animation-delay: 4s;
      }
      .animate-fade-in-up {
        animation: fade-in-up 1s ease-out;
      }
      .animation-delay-200 {
        animation-delay: 200ms;
      }
      .animation-delay-400 {
        animation-delay: 400ms;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
