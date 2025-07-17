import React from "react";

function pad(n) {
  return n < 10 ? "0" + n : String(n);
}

export function getIsoString(date, time) {
  // date: 'YYYY-MM-DD', time: 'HH:MM'
  return new Date(`${date}T${time}`).toISOString();
}

export function getLocalTime(isoString) {
  const date = new Date(isoString);
  const localTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return localTime;
}

export function getLocalDate(isoString) {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
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
