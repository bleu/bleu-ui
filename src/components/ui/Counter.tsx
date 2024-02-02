import React, { useEffect, useState } from "react";

function Counter({ duration, toValue, fromValue, delimiter = ",", ...props }) {
  const [currentValue, setCurrentValue] = useState(fromValue);

  useEffect(() => {
    const difference = toValue - fromValue;
    const startTime = Date.now();

    const updateCounter = () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < duration) {
        const newCount = fromValue + difference * (elapsedTime / duration);
        setCurrentValue(Math.floor(newCount));
        requestAnimationFrame(updateCounter);
      } else {
        setCurrentValue(toValue);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [duration, toValue, fromValue]);

  return (
    <span {...props}>
      {currentValue.toLocaleString("en-US", { useGrouping: delimiter === "," })}
    </span>
  );
}

export { Counter };
