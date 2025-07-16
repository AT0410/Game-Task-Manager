import React from "react";

export function getIsoString(date, time) {
  // date: 'YYYY-MM-DD', time: 'HH:MM'
  return new Date(`${date}T${time}`).toISOString();
}

export function NiceDate(isoString) {
  const date = new Date(isoString);

  // Options for formatting. Tweak to your locale and needs!
  const dateOptions = {
    weekday: "short", // "Fri"
    year: "numeric", // "2025"
    month: "long", // "October"
    day: "numeric", // "10"
  };
  const timeOptions = {
    hour: "2-digit", // "12"
    minute: "2-digit", // "00"
    hour12: true, // "12:00 AM" vs "00:00"
    timeZoneName: "short", // "EDT"
  };

  const datePart = date.toLocaleDateString("en-US", dateOptions);
  const timePart = date.toLocaleTimeString("en-US", timeOptions);
  return `${datePart} ${timePart}`;
}

