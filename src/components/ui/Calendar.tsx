import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

const TimePicker = ({ value, setValue, className = "" }) => (
  <div
    className={cn(
      "flex items-center space-y-2 p-3 sm:space-x-4 sm:space-y-0",
      className
    )}
  >
    <label htmlFor="time" className="text-sm font-medium">
      Pick a time:
      <input
        id="time"
        type="time"
        value={value}
        onChange={setValue}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "form-input text-sm font-medium transition duration-200 ease-in-out",
          "focus:border-accent h-9 rounded-md border dark:border-2 bg-transparent p-2 focus:outline-none"
        )}
      />
    </label>
  </div>
);

const IconLeft = () => <ChevronLeftIcon className="h-4 w-4" />;
const IconRight = () => <ChevronRightIcon className="h-4 w-4" />;

function Calendar({
  withTime = true,
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect: setSelected,
  ...props
}) {
  const [timeValue, setTimeValue] = React.useState<string>(
    selected
      ? `${new Date(selected)
          .getHours()
          .toString()
          .padStart(2, "0")}:${new Date(selected)
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "00:00"
  );

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    let [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));

    hours = !Number.isFinite(hours) || hours < 0 || hours > 23 ? 0 : hours;
    minutes =
      !Number.isFinite(minutes) || minutes < 0 || minutes > 59 ? 0 : minutes;

    const validatedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    if (!selected) {
      setTimeValue(validatedTime);
      return;
    }

    const selectedDate = new Date(selected);
    const newSelectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes
    );
    setSelected(newSelectedDate);
    setTimeValue(validatedTime);
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (!timeValue || !date) {
      setSelected(date);
      return;
    }
    const [hours, minutes] = timeValue
      .split(":")
      .map((str) => parseInt(str, 10));
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    );
    setSelected(newDate);
  };

  return (
    <div>
      <DayPicker
        mode="single"
        showOutsideDays={showOutsideDays}
        selected={selected}
        onSelect={handleDaySelect}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft,
          IconRight,
        }}
        footer={
          withTime ? (
            <TimePicker value={timeValue} setValue={handleTimeChange} />
          ) : null
        }
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
